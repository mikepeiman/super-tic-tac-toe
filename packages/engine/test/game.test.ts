import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
	DEFAULT_CONFIG,
	EMPTY,
	PRESETS,
	adaptPreset,
	boardShapes,
	createGame,
	defaultSeats,
	endTurn,
	finalFill,
	nudgeSide,
	paceOptions,
	parseRecord,
	place,
	planTurn,
	seededRandom,
	serialize,
	takeBack,
	validateConfig,
	type GameConfig,
	type GameState,
	type Result
} from '../src/index.ts';

const PALETTE = 8;

function unwrap<T>(r: Result<T>): T {
	if (!r.ok) throw new Error(r.error);
	return r.value;
}

const game = (config: Partial<GameConfig> = {}, players = 2) =>
	unwrap(createGame({ ...DEFAULT_CONFIG, ...config }, defaultSeats(players)));

/** Play a whole game with a seeded bot for every seat. */
function playOut(state: GameState, level: 'scatter' | 'greedy', seed = 1): GameState {
	const random = seededRandom(seed);
	let s = state;
	while (!s.finished) {
		for (const cell of planTurn(s, level, random)) s = unwrap(place(s, cell));
		if (!s.finished && s.movesLeftInTurn === 0) s = unwrap(endTurn(s));
	}
	return s;
}

describe('turns', () => {
	it('places, takes back and ends a turn with confirmation', () => {
		let s = game({ rows: 4, cols: 4, movesPerTurn: 2, autoEndTurn: false });
		s = unwrap(place(s, 0));
		s = unwrap(place(s, 5));
		expect(s.movesLeftInTurn).toBe(0);
		expect(place(s, 6).ok).toBe(false);
		s = unwrap(takeBack(s, 0));
		expect(s.owners[0]).toBe(EMPTY);
		s = unwrap(place(s, 1));
		expect(s.currentSeat).toBe(0);
		s = unwrap(endTurn(s));
		expect(s.currentSeat).toBe(1);
		expect(s.locked[1]).toBe(1);
		expect(takeBack(s, 1).ok).toBe(false);
		expect(place(s, 1).ok).toBe(false);
	});

	it('ends the turn on the last placement with auto-end on (legacy behaviour)', () => {
		let s = game({ rows: 4, cols: 4, movesPerTurn: 2, autoEndTurn: true });
		s = unwrap(place(s, 0));
		s = unwrap(place(s, 1));
		expect(s.currentSeat).toBe(1);
		expect(s.record.turns).toEqual([{ seat: 0, cells: [0, 1] }]);
	});

	it('refuses End turn before all moves are placed', () => {
		const s = unwrap(place(game({ rows: 4, cols: 4, movesPerTurn: 2, autoEndTurn: false }), 3));
		expect(endTurn(s)).toEqual({ ok: false, error: 'Place 1 more first' });
	});

	it('fills the forced final turn in reading order and finishes', () => {
		// 3 x 4 board, 2 players, 2 moves: 6 turns, the 6th is forced.
		let s = game({ rows: 3, cols: 4, movesPerTurn: 2 });
		for (const cell of [0, 1, 2, 3, 4, 5, 6, 7]) s = unwrap(place(s, cell));
		expect(s.finished).toBe(false);
		s = unwrap(place(s, 11));
		s = unwrap(place(s, 8));
		expect(s.finished).toBe(true);
		expect(finalFill(s)).toEqual({ seat: 1, cells: [9, 10], auto: true });
		expect(s.record.finishedAt).toBeDefined();
	});

	it('addresses cells correctly on boards of 10+ rows and columns (legacy id parsing bug)', () => {
		let s = game({ rows: 15, cols: 15, movesPerTurn: 1 }, 3);
		const cell = 12 * 15 + 11;
		s = unwrap(place(s, cell));
		expect(s.record.turns[0]).toEqual({ seat: 0, cells: [cell] });
		expect(s.owners[cell]).toBe(0);
	});

	it('gives every seat the same number of marks, in turns of exactly M (fairness)', () => {
		fc.assert(
			fc.property(
				fc.integer({ min: 0, max: PRESETS.length - 1 }),
				fc.integer({ min: 2, max: 6 }),
				fc.nat(),
				(pi, players, seed) => {
					const preset = PRESETS[pi]!;
					const config = { ...DEFAULT_CONFIG, ...adaptPreset(preset, players) };
					if (!validateConfig(config, players).ok) return;
					const end = playOut(unwrap(createGame(config, defaultSeats(players))), 'scatter', seed);
					const counts = new Array(players).fill(0);
					end.owners.forEach((o) => counts[o]++);
					expect(new Set(counts).size).toBe(1);
					expect(end.record.turns.every((t) => t.cells.length === config.movesPerTurn)).toBe(true);
				}
			),
			{ numRuns: 40 }
		);
	});
});

describe('fair configuration', () => {
	it('lists the GDD pace options for 2 players on 8 x 14', () => {
		expect(paceOptions(8, 14, 2).map((o) => `${o.movesPerTurn}x${o.rounds}`)).toEqual([
			'1x56',
			'2x28',
			'4x14',
			'7x8',
			'8x7',
			'14x4',
			'28x2',
			'56x1'
		]);
		expect(paceOptions(3, 3, 2)).toEqual([]);
	});

	it('lists the GDD board shapes for 3 players, 4 moves, 8 rounds', () => {
		expect(boardShapes(3, 4, 8).map((b) => `${b.rows}x${b.cols}`)).toEqual([
			'6x16',
			'8x12',
			'12x8',
			'16x6'
		]);
	});

	it('nudges a side to the nearest fair value in the direction of travel', () => {
		expect(nudgeSide(7, 7, 2, 1)).toBe(8);
		expect(nudgeSide(7, 7, 2, -1)).toBe(6);
		expect(nudgeSide(9, 4, 3, 1)).toBe(9);
	});

	it('makes every preset valid for its player count and for 2-8 players where possible', () => {
		for (const p of PRESETS) {
			expect(validateConfig({ ...DEFAULT_CONFIG, ...p.config }, p.players).ok).toBe(true);
			for (let players = 2; players <= 8; players++) {
				const c = { ...DEFAULT_CONFIG, ...adaptPreset(p, players) };
				expect(validateConfig(c, players), `${p.id} for ${players}`).toEqual({
					ok: true,
					value: c
				});
			}
		}
	});

	it('rejects unfair and out-of-range configurations', () => {
		expect(validateConfig({ ...DEFAULT_CONFIG, rows: 7, cols: 7 }, 2).ok).toBe(false);
		expect(validateConfig({ ...DEFAULT_CONFIG, rows: 31 }, 2).ok).toBe(false);
		expect(validateConfig({ ...DEFAULT_CONFIG, cellsToScore: 13 }, 2).ok).toBe(false);
		expect(validateConfig(DEFAULT_CONFIG, 9).ok).toBe(false);
	});
});

describe('records', () => {
	it('round-trips a game in progress, including pending marks', () => {
		let s = game({ rows: 4, cols: 4, movesPerTurn: 2, autoEndTurn: false });
		s = unwrap(place(s, 0));
		s = unwrap(place(s, 1));
		s = unwrap(endTurn(s));
		s = unwrap(place(s, 9));
		const back = unwrap(parseRecord(serialize(s.record), PALETTE));
		expect(Array.from(back.owners)).toEqual(Array.from(s.owners));
		expect(back.record.pending).toEqual([9]);
		expect(back.currentSeat).toBe(1);
	});

	it('round-trips a finished game with identical scores', () => {
		const end = playOut(game({ rows: 6, cols: 6, movesPerTurn: 2 }), 'greedy', 7);
		const back = unwrap(parseRecord(JSON.parse(serialize(end.record)), PALETTE));
		expect(back.finished).toBe(true);
		expect(Array.from(back.owners)).toEqual(Array.from(end.owners));
	});

	it('rejects damaged or tampered records', () => {
		const s = unwrap(place(unwrap(place(game({ rows: 4, cols: 4, movesPerTurn: 2 }), 0)), 1));
		const good = s.record;
		const bad = (r: unknown) => parseRecord(r, PALETTE).ok;
		expect(bad('not json')).toBe(false);
		expect(bad({ ...good, version: 2 })).toBe(false);
		expect(bad({ ...good, turns: [{ seat: 1, cells: [0, 1] }] })).toBe(false);
		expect(bad({ ...good, turns: [{ seat: 0, cells: [0, 0] }] })).toBe(false);
		expect(bad({ ...good, turns: [{ seat: 0, cells: [0] }] })).toBe(false);
		expect(bad({ ...good, pending: [0] })).toBe(false);
		expect(bad({ ...good, config: { ...good.config, cellsToScore: 1 } })).toBe(false);
		expect(bad({ ...good, seats: [good.seats[0], good.seats[0]] })).toBe(false);
	});
});

describe('bots', () => {
	it('completes a run of three when it can (Greedy)', () => {
		let s = game({ rows: 5, cols: 5, movesPerTurn: 1, cellsToScore: 3, lineBonus: 0 }, 5);
		// Seat 0 holds cells 0 and 1; seats 1-4 play far away. Seat 0 to move.
		for (const cell of [0, 24, 20, 4, 14, 1, 23, 22, 21, 19]) s = unwrap(place(s, cell));
		expect(s.currentSeat).toBe(0);
		expect(planTurn(s, 'greedy', seededRandom(1))).toEqual([2]);
	});

	it('blocks a rival run when it has nothing better (Greedy)', () => {
		let s = game({ rows: 4, cols: 6, movesPerTurn: 1, cellsToScore: 3, lineBonus: 0 });
		// Seat 1 holds 12 and 13 at the start of row 2, so only 14 completes its run.
		// Seat 0's corner marks cannot make a run of three this move.
		for (const cell of [0, 12, 5, 13]) s = unwrap(place(s, cell));
		expect(planTurn(s, 'greedy', seededRandom(3))).toEqual([14]);
	});

	it('plays whole games to completion at both levels', () => {
		for (const level of ['scatter', 'greedy'] as const) {
			const end = playOut(game({ rows: 6, cols: 8, movesPerTurn: 3 }, 2), level, 11);
			expect(end.finished).toBe(true);
		}
	});
});
