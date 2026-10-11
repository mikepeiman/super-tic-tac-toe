import {
	createGame,
	DIRECTIONS,
	endTurn,
	finalFill,
	place,
	restart,
	scoreBoard,
	takeBack,
	updateSeat,
	type GameState,
	type Result,
	type Seat,
	type SeatScore
} from '@sttt/engine';
import type { BotRequest, BotResponse } from './bot.worker.ts';
import { prefs } from './prefs.svelte.ts';
import { sounds } from './sound.ts';
import { addToHistory, saveCurrent } from './storage.ts';

/**
 * play: turns are being taken. cascade: the forced final turn is filling in.
 * tally: scores are revealed one direction at a time. done: the game is over.
 */
export type Phase = 'play' | 'cascade' | 'tally' | 'done';

export const CASCADE_MS = 1500;
const TALLY_STEP_MS = 900;
const BOT_STEP_MS = 260;
const HANDOVER_MS = 1400;
const ZERO_WIDTH_SPACE = String.fromCharCode(0x200b);

/**
 * The game screen's single source of state. It wraps an immutable engine state, saves the
 * record on every change, drives bot seats through a Web Worker, and sequences the end of the
 * game. Components render from it and call its methods; none of them touch the engine directly.
 */
export class Game {
	state = $state.raw() as GameState;
	phase = $state<Phase>('play');
	/** Scores from the last Tally, shown while Live score is off. */
	tallied = $state.raw<SeatScore[] | undefined>();
	/** During the end tally, how many directions have been revealed (0-4). */
	revealed = $state<number>(DIRECTIONS.length);
	/** Seat named by the pass-and-play handover banner. */
	handover = $state<number | undefined>();
	botThinking = $state(false);
	announcement = $state('');

	scores = $derived(
		scoreBoard(this.state.owners, this.state.record.config, this.state.record.seats.length)
	);

	/** What the scoreboard may show right now: live, last tally, or nothing yet. */
	visibleScores = $derived.by((): SeatScore[] | undefined => {
		if (this.phase === 'tally' || this.phase === 'done') return this.scores;
		if (this.state.record.config.liveScore) return this.scores;
		return this.tallied;
	});

	// Internal bookkeeping, never rendered.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	#timers = new Set<ReturnType<typeof setTimeout>>();
	#worker: Worker | undefined;
	#botRequest = 0;

	constructor(state: GameState) {
		this.#load(state);
	}

	get config() {
		return this.state.record.config;
	}
	get seats() {
		return this.state.record.seats;
	}
	get current(): Seat {
		return this.seats[this.state.currentSeat]!;
	}
	get humansCount() {
		return this.seats.filter((s) => s.kind === 'human').length;
	}
	/** A human may act on the board now. */
	get canAct() {
		return this.phase === 'play' && this.current.kind === 'human' && !this.botThinking;
	}

	/* ---------- Player actions ---------- */

	/** Place on an empty cell, or take back one of this turn's marks. */
	activate(cell: number) {
		if (!this.canAct) return;
		if (this.state.record.pending.includes(cell)) return this.takeBack(cell);
		if (this.state.locked[cell]) {
			sounds.deny();
			this.#say('That mark is locked.');
			return;
		}
		this.place(cell);
	}

	place(cell: number) {
		const seat = this.state.currentSeat;
		if (this.#apply(place(this.state, cell))) sounds.place(seat);
	}

	takeBack(cell: number) {
		if (!this.canAct) return;
		if (this.#apply(takeBack(this.state, cell))) sounds.takeBack();
	}

	takeBackLast() {
		const last = this.state.record.pending.at(-1);
		if (last !== undefined) this.takeBack(last);
	}

	endTurn() {
		if (!this.canAct) return;
		this.#apply(endTurn(this.state));
	}

	/** Reveal the scores as they stand (the legacy Tally Scores button). */
	tally() {
		this.tallied = this.scores;
		this.#say(this.#scoreSummary());
	}

	restart() {
		this.#cancelBot();
		this.#load(restart(this.state));
		saveCurrent(this.state.record);
	}

	/** A new game with the same settings, seats rotated so a different player moves first. */
	rematch() {
		const [first, ...rest] = this.seats;
		const next = createGame(this.config, [...rest, first!]);
		if (!next.ok) return;
		this.#cancelBot();
		this.#load(next.value);
		saveCurrent(this.state.record);
	}

	editSeat(seat: number, patch: Partial<Pick<Seat, 'name' | 'mark' | 'color'>>) {
		this.state = updateSeat(this.state, seat, patch);
		saveCurrent(this.state.record);
	}

	/** Jump past the end-of-game animations. */
	skipTally() {
		if (this.phase === 'cascade' || this.phase === 'tally') this.#finish();
	}

	destroy() {
		this.#cancelBot();
		this.#worker?.terminate();
		this.#clearTimers();
	}

	/* ---------- Internals ---------- */

	#load(state: GameState) {
		this.#clearTimers();
		this.state = state;
		this.tallied = undefined;
		this.handover = undefined;
		if (state.finished) {
			this.phase = 'done';
			this.revealed = DIRECTIONS.length;
		} else {
			this.phase = 'play';
			this.#say(`${this.current.name} to play. ${state.movesLeftInTurn} moves this turn.`);
			this.#maybeRunBot();
		}
	}

	#apply(result: Result<GameState>): boolean {
		if (!result.ok) {
			sounds.deny();
			this.#say(result.error);
			return false;
		}
		const before = this.state;
		this.state = result.value;
		saveCurrent(this.state.record);

		const turnEnded = this.state.record.turns.length !== before.record.turns.length;
		if (this.state.finished) {
			this.#startFinish();
		} else if (turnEnded) {
			this.#onTurnStart();
		}
		return true;
	}

	#onTurnStart() {
		const seat = this.current;
		this.#say(`${seat.name}’s turn. ${this.state.movesLeftInTurn} moves.`);
		if (seat.kind === 'human') {
			sounds.turn();
			// In pass-and-play, name the next player so the device can be handed over.
			if (this.humansCount > 1) {
				this.handover = this.state.currentSeat;
				this.#later(() => (this.handover = undefined), HANDOVER_MS);
			}
		}
		this.#maybeRunBot();
	}

	#startFinish() {
		this.#cancelBot();
		this.handover = undefined;
		const cascade = finalFill(this.state) && !prefs.reducedMotion;
		this.phase = cascade ? 'cascade' : 'tally';
		this.revealed = 0;
		this.#later(() => this.#tallyStep(), cascade ? CASCADE_MS + 200 : 0);
	}

	#tallyStep() {
		if (this.phase === 'done') return;
		this.phase = 'tally';
		if (prefs.reducedMotion) return this.#finish();
		sounds.tick();
		this.revealed += 1;
		if (this.revealed >= DIRECTIONS.length) this.#later(() => this.#finish(), TALLY_STEP_MS);
		else this.#later(() => this.#tallyStep(), TALLY_STEP_MS);
	}

	#finish() {
		this.#clearTimers();
		this.phase = 'done';
		this.revealed = DIRECTIONS.length;
		this.tallied = this.scores;
		sounds.fanfare();
		this.#say(`Game over. ${this.#scoreSummary()}`);
		void addToHistory(this.state.record);
	}

	#scoreSummary() {
		return this.scores.map((s) => `${this.seats[s.seat]!.name} ${s.total}`).join(', ') + '.';
	}

	/* ---------- Bots ---------- */

	#maybeRunBot() {
		if (this.phase !== 'play' || this.current.kind !== 'bot' || this.botThinking) return;
		if (typeof Worker === 'undefined') return;
		this.#worker ??= this.#createWorker();
		const id = ++this.#botRequest;
		this.botThinking = true;
		const request: BotRequest = { id, record: $state.snapshot(this.state.record) };
		this.#worker.postMessage(request);
	}

	#createWorker() {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- a module URL, not state
		const worker = new Worker(new URL('./bot.worker.ts', import.meta.url), { type: 'module' });
		worker.addEventListener('message', (e: MessageEvent<BotResponse>) => {
			if (e.data.id !== this.#botRequest) return; // a restart cancelled this request
			this.#playBotCells(e.data.id, [...e.data.cells]);
		});
		return worker;
	}

	#playBotCells(id: number, cells: number[]) {
		if (id !== this.#botRequest) return;
		const cell = cells.shift();
		if (cell === undefined) {
			this.botThinking = false;
			if (this.state.movesLeftInTurn === 0 && !this.state.finished && this.phase === 'play') {
				this.#apply(endTurn(this.state));
			}
			return;
		}
		const seat = this.state.currentSeat;
		const before = this.state.record.turns.length;
		if (this.#apply(place(this.state, cell))) sounds.place(seat);
		const turnEnded = this.state.record.turns.length !== before;
		if (turnEnded || this.state.finished) {
			this.botThinking = false;
			// #apply already started the next turn; it may be another bot.
			if (turnEnded && !this.state.finished) this.#maybeRunBot();
			return;
		}
		this.#later(() => this.#playBotCells(id, cells), prefs.reducedMotion ? 0 : BOT_STEP_MS);
	}

	#cancelBot() {
		this.#botRequest++;
		this.botThinking = false;
	}

	/* ---------- Helpers ---------- */

	#say(text: string) {
		// Re-announce identical messages by toggling a zero-width space.
		this.announcement = this.announcement === text ? text + ZERO_WIDTH_SPACE : text;
	}

	#later(fn: () => void, ms: number) {
		const t = setTimeout(() => {
			this.#timers.delete(t);
			fn();
		}, ms);
		this.#timers.add(t);
	}

	#clearTimers() {
		this.#timers.forEach(clearTimeout);
		this.#timers.clear();
	}
}
