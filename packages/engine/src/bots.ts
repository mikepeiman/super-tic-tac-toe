import type { GameState } from './game.ts';
import { EMPTY, lineValue } from './scoring.ts';
import { topology } from './topology.ts';
import type { BotLevel } from './types.ts';

export type Random = () => number;

/** Small, fast, seedable PRNG (mulberry32) so bot games can be replayed in tests. */
export function seededRandom(seed: number): Random {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * How much `seat` would gain by owning `cell`: the change in run points and bonuses across the
 * four lines through it. Owners are modified temporarily and restored.
 */
export function gainAt(owners: Int8Array, cell: number, seat: number, state: GameState): number {
	const { config } = state.record;
	const topo = topology(config.rows, config.cols, config.lineBonus);
	const prev = owners[cell]!;
	let before = 0;
	let after = 0;
	for (const li of topo.cellLines[cell]!)
		before += lineValue(owners, topo.lines[li]!, seat, config.cellsToScore);
	owners[cell] = seat;
	for (const li of topo.cellLines[cell]!)
		after += lineValue(owners, topo.lines[li]!, seat, config.cellsToScore);
	owners[cell] = prev;
	return after - before;
}

/**
 * Greedy value of a cell: the best of taking points for ourselves and denying a rival the
 * points they would make there, with a light pull towards cells that join our own marks.
 */
function greedyValue(owners: Int8Array, cell: number, seat: number, state: GameState): number {
	const seats = state.record.seats.length;
	const mine = gainAt(owners, cell, seat, state);
	let threat = 0;
	for (let s = 0; s < seats; s++)
		if (s !== seat) threat = Math.max(threat, gainAt(owners, cell, s, state));

	// Potential: our own neighbours along each line make future runs likelier.
	const { rows, cols } = state.record.config;
	const r = Math.floor(cell / cols);
	const c = cell % cols;
	let friends = 0;
	for (let dr = -1; dr <= 1; dr++) {
		for (let dc = -1; dc <= 1; dc++) {
			if (!dr && !dc) continue;
			const rr = r + dr;
			const cc = c + dc;
			if (rr >= 0 && rr < rows && cc >= 0 && cc < cols && owners[rr * cols + cc] === seat)
				friends++;
		}
	}
	return Math.max(mine, threat * 0.9) + friends * 0.05;
}

/**
 * The cells a bot places this turn, in order. Each pick sees the bot's earlier picks this turn.
 */
export function planTurn(
	state: GameState,
	level: BotLevel,
	random: Random = Math.random
): number[] {
	const owners = Int8Array.from(state.owners);
	const seat = state.currentSeat;
	const picks: number[] = [];
	for (let n = 0; n < state.movesLeftInTurn; n++) {
		const empty: number[] = [];
		owners.forEach((o, i) => o === EMPTY && empty.push(i));
		if (empty.length === 0) break;
		let pick: number;
		if (level === 'scatter') {
			pick = empty[Math.floor(random() * empty.length)]!;
		} else {
			let best = -Infinity;
			let ties: number[] = [];
			for (const cell of empty) {
				const v = greedyValue(owners, cell, seat, state);
				if (v > best + 1e-9) {
					best = v;
					ties = [cell];
				} else if (Math.abs(v - best) <= 1e-9) ties.push(cell);
			}
			pick = ties[Math.floor(random() * ties.length)]!;
		}
		owners[pick] = seat;
		picks.push(pick);
	}
	return picks;
}
