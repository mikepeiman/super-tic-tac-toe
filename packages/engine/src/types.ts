/** The four scoring directions, in the legacy scoreboard order. */
export const DIRECTIONS = [
	'horizontal',
	'vertical',
	'diagonalDownLeft',
	'diagonalDownRight'
] as const;
export type Direction = (typeof DIRECTIONS)[number];

/** Parameters fixed when a game starts (GDD section 2). */
export interface GameConfig {
	rows: number;
	cols: number;
	movesPerTurn: number;
	/** N: the run length that earns the first point. */
	cellsToScore: number;
	/** B: the full line bonus; 0 turns bonuses off. */
	lineBonus: number;
	/** End the turn on the last placement instead of waiting for End turn. */
	autoEndTurn: boolean;
	/** Show scores during play; otherwise they appear on Tally or at the end. */
	liveScore: boolean;
}

export type BotLevel = 'scatter' | 'greedy';

export interface Seat {
	name: string;
	/** An emoji (or any short grapheme cluster). Unique within a game. */
	mark: string;
	/** Index into the player colour palette. Unique within a game. */
	color: number;
	kind: 'human' | 'bot';
	bot?: BotLevel;
}

export interface Turn {
	seat: number;
	/** Cell indexes (row * cols + col) in placement order. */
	cells: number[];
	/** True for the forced final turn filled by the game. */
	auto?: boolean;
}

/** The persisted source of truth for a game (GDD section 9). */
export interface GameRecord {
	version: 1;
	id: string;
	createdAt: string;
	finishedAt?: string;
	config: GameConfig;
	seats: Seat[];
	turns: Turn[];
	/** The open turn's placed cells, in placement order. */
	pending: number[];
}

export interface DirectionScore {
	points: number;
	bonus: number;
}

export interface SeatScore {
	seat: number;
	total: number;
	runPoints: number;
	bonus: number;
	longestRun: number;
	byDirection: DirectionScore[];
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const fail = <T>(error: string): Result<T> => ({ ok: false, error });
