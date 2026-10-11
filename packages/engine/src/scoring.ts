import { DIRECTIONS, type GameConfig, type SeatScore } from './types.ts';
import { topology, type Line } from './topology.ts';

/** Owner of each cell: a seat index, or -1 when empty. */
export type Owners = ArrayLike<number>;

export const EMPTY = -1;

export interface Run {
	seat: number;
	dir: number;
	cells: number[];
	points: number;
}

/** Points for a run of k marks when N marks are needed to score. */
export const runPoints = (k: number, n: number) => Math.max(0, k - n + 1);

/** Visit every maximal run of one owner along a line. */
function eachRun(
	owners: Owners,
	line: Line,
	visit: (seat: number, start: number, end: number) => void
) {
	const { cells } = line;
	let start = 0;
	for (let i = 1; i <= cells.length; i++) {
		const prev = owners[cells[i - 1]!]!;
		if (i === cells.length || owners[cells[i]!] !== prev) {
			if (prev !== EMPTY) visit(prev, start, i);
			start = i;
		}
	}
}

/** Run points plus bonus that one line gives to one seat. Used for incremental bot evaluation. */
export function lineValue(owners: Owners, line: Line, seat: number, n: number): number {
	let value = 0;
	eachRun(owners, line, (s, start, end) => {
		if (s !== seat) return;
		value += runPoints(end - start, n);
		if (end - start === line.cells.length) value += line.bonus;
	});
	return value;
}

/** Score every seat on the board (GDD section 3). Pending marks count as owned. */
export function scoreBoard(owners: Owners, config: GameConfig, seatCount: number): SeatScore[] {
	const topo = topology(config.rows, config.cols, config.lineBonus);
	const scores: SeatScore[] = Array.from({ length: seatCount }, (_, seat) => ({
		seat,
		total: 0,
		runPoints: 0,
		bonus: 0,
		longestRun: 0,
		byDirection: DIRECTIONS.map(() => ({ points: 0, bonus: 0 }))
	}));

	for (const line of topo.lines) {
		eachRun(owners, line, (seat, start, end) => {
			const s = scores[seat];
			if (!s) return;
			const len = end - start;
			const d = s.byDirection[line.dir]!;
			const pts = runPoints(len, config.cellsToScore);
			d.points += pts;
			s.runPoints += pts;
			if (len > s.longestRun) s.longestRun = len;
			if (len === line.cells.length && line.bonus > 0) {
				d.bonus += line.bonus;
				s.bonus += line.bonus;
			}
		});
	}
	for (const s of scores) s.total = s.runPoints + s.bonus;
	return scores;
}

/** Every scoring run and fully owned bonus line, for board highlighting. */
export function scoringRuns(
	owners: Owners,
	config: GameConfig
): { runs: Run[]; bonusLines: Line[] } {
	const topo = topology(config.rows, config.cols, config.lineBonus);
	const runs: Run[] = [];
	const bonusLines: Line[] = [];
	for (const line of topo.lines) {
		eachRun(owners, line, (seat, start, end) => {
			const points = runPoints(end - start, config.cellsToScore);
			if (points > 0)
				runs.push({ seat, dir: line.dir, cells: line.cells.slice(start, end), points });
			if (end - start === line.cells.length && line.bonus > 0) bonusLines.push(line);
		});
	}
	return { runs, bonusLines };
}

/**
 * Seats ordered best first by the GDD tie-breaks: total, run points, longest run.
 * Seats still level share a place.
 */
export function rank(scores: SeatScore[]): { seat: number; place: number }[] {
	const cmp = (a: SeatScore, b: SeatScore) =>
		b.total - a.total || b.runPoints - a.runPoints || b.longestRun - a.longestRun;
	const sorted = [...scores].sort(cmp);
	return sorted.map((s, i) => {
		let place = i + 1;
		for (let j = i - 1; j >= 0 && cmp(sorted[j]!, s) === 0; j--) place = j + 1;
		return { seat: s.seat, place };
	});
}
