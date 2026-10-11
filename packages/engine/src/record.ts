import { validateConfig, validateSeats } from './config.ts';
import { derive, type GameState } from './game.ts';
import { EMPTY } from './scoring.ts';
import { fail, ok, type GameRecord, type Result } from './types.ts';

export const RECORD_VERSION = 1;

/** File extension for exported games. */
export const RECORD_EXTENSION = '.sttt.json';

export const serialize = (record: GameRecord) => JSON.stringify(record);

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const isIntArray = (v: unknown): v is number[] => Array.isArray(v) && v.every(Number.isInteger);

/**
 * Parse and check an untrusted record (an imported file or stored data) by replaying it:
 * every turn must be the right seat, the right size, and only fill empty cells.
 */
export function parseRecord(input: unknown, paletteSize: number): Result<GameState> {
	let data = input;
	if (typeof input === 'string') {
		try {
			data = JSON.parse(input);
		} catch {
			return fail('This file is not a saved game');
		}
	}
	if (!isObject(data) || data.version !== RECORD_VERSION)
		return fail('This file is not a saved game');
	const { config, seats, turns, pending, id, createdAt } = data;
	if (!isObject(config) || !Array.isArray(seats) || !Array.isArray(turns) || !isIntArray(pending))
		return fail('This saved game is incomplete');
	if (typeof id !== 'string' || typeof createdAt !== 'string')
		return fail('This saved game is incomplete');

	const record = data as unknown as GameRecord;
	const validConfig = validateConfig(record.config, record.seats.length);
	if (!validConfig.ok) return fail(validConfig.error);
	const validSeats = validateSeats(record.seats, paletteSize);
	if (!validSeats.ok) return fail(validSeats.error);

	const { rows, cols, movesPerTurn } = record.config;
	const size = rows * cols;
	const owners = new Int8Array(size).fill(EMPTY);
	const claim = (cell: number) => {
		if (cell < 0 || cell >= size || owners[cell] !== EMPTY) return false;
		owners[cell] = 0;
		return true;
	};
	for (const [i, turn] of record.turns.entries()) {
		if (!isObject(turn) || !isIntArray(turn.cells)) return fail('This saved game is damaged');
		if (turn.seat !== i % record.seats.length)
			return fail('This saved game has turns out of order');
		const isLast = i === record.turns.length - 1;
		const sizeOk = turn.cells.length === movesPerTurn;
		if (!sizeOk) return fail('This saved game has a turn of the wrong size');
		if (turn.auto && !isLast) return fail('This saved game is damaged');
		if (!turn.cells.every(claim)) return fail('This saved game places two marks in one cell');
	}
	if (record.pending.length > movesPerTurn || !record.pending.every(claim))
		return fail('This saved game is damaged');

	const state = derive(record);
	// A finished game must not leave the final turn open.
	if (state.movesPlayed === size && record.pending.length > 0)
		return fail('This saved game is damaged');
	return ok(state);
}
