import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
	DEFAULT_CONFIG,
	EMPTY,
	rank,
	scoreBoard,
	scoringRuns,
	topology,
	type GameConfig,
	type SeatScore
} from '../src/index.ts';
import { legacyScores } from './legacy-oracle.js';

const cfg = (rows: number, cols: number, cellsToScore: number, lineBonus: number): GameConfig => ({
	...DEFAULT_CONFIG,
	rows,
	cols,
	cellsToScore,
	lineBonus
});

/** Build owners from rows of characters: '.' empty, 'A'.. seats. */
function board(...lines: string[]): { owners: Int8Array; rows: number; cols: number } {
	const rows = lines.length;
	const cols = lines[0]!.length;
	const owners = new Int8Array(rows * cols).fill(EMPTY);
	lines.forEach((line, r) =>
		[...line].forEach((ch, c) => {
			if (ch !== '.') owners[r * cols + c] = ch.charCodeAt(0) - 65;
		})
	);
	return { owners, rows, cols };
}

const asLegacyShape = (s: SeatScore[]) => s.map((x) => x.byDirection.map((d) => ({ ...d })));

describe('lines', () => {
	it('has R rows, C columns and R+C-1 lines per diagonal direction', () => {
		for (const [r, c] of [
			[3, 3],
			[8, 14],
			[14, 8],
			[30, 30],
			[3, 30]
		] as const) {
			const t = topology(r, c, 0);
			const per = [0, 0, 0, 0];
			t.lines.forEach((l) => per[l.dir]!++);
			expect(per).toEqual([r, c, r + c - 1, r + c - 1]);
			// Every cell sits on exactly one line per direction.
			expect(t.cellLines.every((ls) => ls.length === 4)).toBe(true);
		}
	});

	it('gives the GDD bonuses on 8 x 14 with B = 12', () => {
		const t = topology(8, 14, 12);
		const bonusesFor = (dir: number) =>
			[
				...new Set(t.lines.filter((l) => l.dir === dir).map((l) => `${l.cells.length}:${l.bonus}`))
			].sort();
		expect(bonusesFor(0)).toEqual(['14:12']);
		expect(bonusesFor(1)).toEqual(['8:7']);
		const diag = t.lines.filter((l) => l.dir === 2);
		expect(diag.filter((l) => l.bonus === 7)).toHaveLength(7);
		expect(diag.filter((l) => l.bonus === 0)).toHaveLength(14);
	});
});

describe('scoring', () => {
	it('scores the GDD example row: runs of 5, 3 and 2 with N = 3', () => {
		const { owners, rows, cols } = board('AAAAABAAABAABB');
		const [a, b] = scoreBoard(owners, cfg(rows, cols, 3, 0), 2);
		expect(a!.byDirection[0]!.points).toBe(4);
		expect(b!.byDirection[0]!.points).toBe(0);
	});

	it('gives a 3 x 3 block 8 points with N = 3', () => {
		const { owners, rows, cols } = board('AAA..', 'AAA..', 'AAA..', '.....', '.....');
		const [a] = scoreBoard(owners, cfg(rows, cols, 3, 0), 1);
		expect(a!.total).toBe(8);
		expect(a!.longestRun).toBe(3);
	});

	it('gives a fully owned 14-cell row 12 run points plus a 12 bonus', () => {
		const lines = ['AAAAAAAAAAAAAA', ...Array.from({ length: 7 }, () => '..............')];
		const { owners } = board(...lines);
		const [a] = scoreBoard(owners, cfg(8, 14, 3, 12), 1);
		expect(a!.byDirection[0]).toEqual({ points: 12, bonus: 12 });
	});

	it('gives both main diagonals of a square board the full bonus', () => {
		const { owners, rows, cols } = board('A..A', '.AA.', '.AA.', 'A..A');
		const [a] = scoreBoard(owners, cfg(rows, cols, 3, 10), 1);
		expect(a!.byDirection[2]!.bonus).toBe(10);
		expect(a!.byDirection[3]!.bonus).toBe(10);
		expect(a!.bonus).toBe(20);
	});

	it('kills a bonus with one enemy or empty cell', () => {
		const { owners, rows, cols } = board('AAAB', '....', '....');
		const [a] = scoreBoard(owners, cfg(rows, cols, 3, 10), 2);
		expect(a!.bonus).toBe(0);
	});

	it('lists scoring runs and bonus lines for highlighting', () => {
		const { owners, rows, cols } = board('AAA', 'B.B', '...');
		const { runs, bonusLines } = scoringRuns(owners, cfg(rows, cols, 3, 5));
		expect(runs).toEqual([{ seat: 0, dir: 0, cells: [0, 1, 2], points: 1 }]);
		expect(bonusLines).toHaveLength(1);
	});

	it('matches the legacy scorer on random boards', () => {
		fc.assert(
			fc.property(
				fc.record({
					rows: fc.integer({ min: 3, max: 14 }),
					cols: fc.integer({ min: 3, max: 14 }),
					players: fc.integer({ min: 2, max: 8 }),
					bonus: fc.integer({ min: 0, max: 40 }),
					nSeed: fc.nat(),
					fill: fc.double({ min: 0.3, max: 1, noNaN: true }),
					seed: fc.nat()
				}),
				({ rows, cols, players, bonus, nSeed, fill, seed }) => {
					const n = 2 + (nSeed % (Math.max(rows, cols) - 1));
					let s = seed;
					const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
					const owners = new Int8Array(rows * cols).fill(EMPTY);
					// Clumpy boards exercise long runs and full lines, not just noise.
					const bias = Math.floor(rnd() * players);
					for (let i = 0; i < owners.length; i++) {
						if (rnd() > fill) continue;
						owners[i] = rnd() < 0.5 ? bias : Math.floor(rnd() * players);
					}
					const ours = asLegacyShape(scoreBoard(owners, cfg(rows, cols, n, bonus), players));
					const theirs = legacyScores(Array.from(owners), rows, cols, players, n, bonus);
					expect(ours).toEqual(theirs);
				}
			),
			{ numRuns: 3000 }
		);
	});

	it('matches the legacy scorer on fully owned boards (every bonus line)', () => {
		for (const [rows, cols] of [
			[8, 14],
			[14, 8],
			[5, 8],
			[6, 6],
			[10, 3]
		] as const) {
			const owners = new Int8Array(rows * cols).fill(0);
			const ours = asLegacyShape(scoreBoard(owners, cfg(rows, cols, 3, 12), 2));
			expect(ours).toEqual(legacyScores(Array.from(owners), rows, cols, 2, 3, 12));
		}
	});

	it('is unchanged by mirroring the board left to right (diagonals swap)', () => {
		fc.assert(
			fc.property(
				fc.integer({ min: 3, max: 12 }),
				fc.integer({ min: 3, max: 12 }),
				fc.array(fc.integer({ min: -1, max: 2 }), { minLength: 144, maxLength: 144 }),
				(rows, cols, cells) => {
					const owners = Int8Array.from(cells.slice(0, rows * cols));
					const mirrored = new Int8Array(rows * cols);
					for (let r = 0; r < rows; r++)
						for (let c = 0; c < cols; c++)
							mirrored[r * cols + (cols - 1 - c)] = owners[r * cols + c]!;
					const c3 = cfg(rows, cols, 3, 9);
					const a = scoreBoard(owners, c3, 3);
					const b = scoreBoard(mirrored, c3, 3);
					a.forEach((s, i) => {
						const m = b[i]!;
						expect(m.total).toBe(s.total);
						expect(m.byDirection[2]).toEqual(s.byDirection[3]);
						expect(m.byDirection[3]).toEqual(s.byDirection[2]);
					});
				}
			),
			{ numRuns: 300 }
		);
	});
});

describe('rank', () => {
	const s = (seat: number, total: number, runPoints: number, longestRun: number): SeatScore => ({
		seat,
		total,
		runPoints,
		bonus: total - runPoints,
		longestRun,
		byDirection: []
	});

	it('orders by total, then run points, then longest run, sharing exact ties', () => {
		const order = rank([
			s(0, 10, 4, 3),
			s(1, 10, 6, 3),
			s(2, 12, 2, 2),
			s(3, 10, 6, 3),
			s(4, 10, 6, 5)
		]);
		expect(order).toEqual([
			{ seat: 2, place: 1 },
			{ seat: 4, place: 2 },
			{ seat: 1, place: 3 },
			{ seat: 3, place: 3 },
			{ seat: 0, place: 5 }
		]);
	});
});
