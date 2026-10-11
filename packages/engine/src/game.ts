import { validateConfig } from './config.ts';
import { EMPTY } from './scoring.ts';
import { fail, ok, type GameConfig, type GameRecord, type Result, type Seat } from './types.ts';

/** Everything derived from a record. Recomputed, never stored. */
export interface GameState {
	record: GameRecord;
	/** Owner seat of each cell, -1 when empty. Includes pending marks. */
	owners: Int8Array;
	/** Cells whose marks are locked (from finished turns). */
	locked: Uint8Array;
	currentSeat: number;
	/** 1-based round of the current turn. */
	round: number;
	rounds: number;
	movesPlayed: number;
	movesLeftInTurn: number;
	totalCells: number;
	finished: boolean;
}

const newId = () =>
	(globalThis as { crypto?: { randomUUID?: () => string } }).crypto?.randomUUID?.() ??
	`g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export function createGame(config: GameConfig, seats: Seat[], now = new Date()): Result<GameState> {
	const valid = validateConfig(config, seats.length);
	if (!valid.ok) return fail(valid.error);
	const record: GameRecord = {
		version: 1,
		id: newId(),
		createdAt: now.toISOString(),
		config: { ...config },
		seats: seats.map((s) => ({ ...s })),
		turns: [],
		pending: []
	};
	return ok(derive(record));
}

/** Rebuild the full state from a record. Assumes the record is legal (see parseRecord). */
export function derive(record: GameRecord): GameState {
	const { config, seats, turns, pending } = record;
	const totalCells = config.rows * config.cols;
	const owners = new Int8Array(totalCells).fill(EMPTY);
	const locked = new Uint8Array(totalCells);
	for (const turn of turns) {
		for (const cell of turn.cells) {
			owners[cell] = turn.seat;
			locked[cell] = 1;
		}
	}
	const currentSeat = turns.length % seats.length;
	for (const cell of pending) owners[cell] = currentSeat;
	const movesPlayed = turns.reduce((n, t) => n + t.cells.length, 0) + pending.length;
	const finished = movesPlayed === totalCells && pending.length === 0;
	const rounds = totalCells / (seats.length * config.movesPerTurn);
	return {
		record,
		owners,
		locked,
		currentSeat,
		round: Math.min(rounds, Math.floor(turns.length / seats.length) + 1),
		rounds,
		movesPlayed,
		movesLeftInTurn: finished ? 0 : config.movesPerTurn - pending.length,
		totalCells,
		finished
	};
}

const withRecord = (state: GameState, patch: Partial<GameRecord>) =>
	derive({ ...state.record, ...patch });

/** Place the current player's mark. Ends the turn automatically when the room says so. */
export function place(state: GameState, cell: number, now = new Date()): Result<GameState> {
	if (state.finished) return fail('The game is over');
	if (!Number.isInteger(cell) || cell < 0 || cell >= state.totalCells) return fail('No such cell');
	if (state.owners[cell] !== EMPTY) return fail('That cell is taken');
	if (state.movesLeftInTurn === 0) return fail('No moves left this turn');
	const next = withRecord(state, { pending: [...state.record.pending, cell] });
	if (next.movesLeftInTurn === 0 && next.record.config.autoEndTurn) return endTurn(next, now);
	return ok(next);
}

/** Take back one of this turn's pending marks. */
export function takeBack(state: GameState, cell: number): Result<GameState> {
	if (!state.record.pending.includes(cell)) return fail('Only this turn’s marks can be taken back');
	return ok(withRecord(state, { pending: state.record.pending.filter((c) => c !== cell) }));
}

/**
 * Lock the pending marks and pass play on. When exactly one turn remains, the empty cells are
 * that player's only possible moves, so they are filled in reading order and the game ends.
 */
export function endTurn(state: GameState, now = new Date()): Result<GameState> {
	if (state.finished) return fail('The game is over');
	if (state.movesLeftInTurn !== 0) return fail(`Place ${state.movesLeftInTurn} more first`);
	const { record } = state;
	const turns = [...record.turns, { seat: state.currentSeat, cells: [...record.pending] }];
	let next = derive({ ...record, turns, pending: [] });

	const empty = next.totalCells - next.movesPlayed;
	if (empty === record.config.movesPerTurn) {
		const cells: number[] = [];
		next.owners.forEach((o, i) => o === EMPTY && cells.push(i));
		next = derive({
			...next.record,
			turns: [...turns, { seat: next.currentSeat, cells, auto: true }]
		});
	}
	if (next.finished) next = derive({ ...next.record, finishedAt: now.toISOString() });
	return ok(next);
}

/** The forced final turn, if the game ended with one. Used to animate the cascade. */
export const finalFill = (state: GameState) => {
	const last = state.record.turns.at(-1);
	return last?.auto ? last : undefined;
};

/** Restart with the same configuration and seats. */
export function restart(state: GameState, now = new Date()): GameState {
	const r = createGame(state.record.config, state.record.seats, now);
	if (!r.ok) throw new Error(r.error);
	return r.value;
}

/** Cosmetic seat changes (name, mark, colour) are allowed at any time. */
export function updateSeat(
	state: GameState,
	seat: number,
	patch: Partial<Pick<Seat, 'name' | 'mark' | 'color'>>
): GameState {
	const seats = state.record.seats.map((s, i) => (i === seat ? { ...s, ...patch } : s));
	return withRecord(state, { seats });
}

export function emptyCells(state: GameState): number[] {
	const out: number[] = [];
	state.owners.forEach((o, i) => o === EMPTY && out.push(i));
	return out;
}
