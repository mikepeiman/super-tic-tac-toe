import { fail, ok, type GameConfig, type Result, type Seat } from './types.ts';

export const LIMITS = {
	minSide: 3,
	maxSide: 30,
	minPlayers: 2,
	maxPlayers: 8,
	maxBonus: 100,
	maxAspect: 3
} as const;

export const DEFAULT_CONFIG: GameConfig = {
	rows: 8,
	cols: 12,
	movesPerTurn: 4,
	cellsToScore: 3,
	lineBonus: 12,
	autoEndTurn: true,
	liveScore: false
};

/** All positive divisors of n, ascending. */
export function divisors(n: number): number[] {
	const out: number[] = [];
	for (let i = 1; i <= n; i++) if (n % i === 0) out.push(i);
	return out;
}

/** Rounds in a game: cells / (players x moves per turn). */
export const roundsOf = (config: GameConfig, players: number) =>
	(config.rows * config.cols) / (players * config.movesPerTurn);

export const isFair = (rows: number, cols: number, players: number, movesPerTurn: number) =>
	(rows * cols) % (players * movesPerTurn) === 0;

export interface PaceOption {
	movesPerTurn: number;
	rounds: number;
}

/** Setup method A: every (moves per turn, rounds) pair that fits the board (GDD section 4). */
export function paceOptions(rows: number, cols: number, players: number): PaceOption[] {
	const perPlayer = (rows * cols) / players;
	if (!Number.isInteger(perPlayer)) return [];
	return divisors(perPlayer).map((m) => ({ movesPerTurn: m, rounds: perPlayer / m }));
}

export interface BoardShape {
	rows: number;
	cols: number;
}

/** Setup method B: every board shape for a pace, sides 3-30, aspect no worse than 3:1. */
export function boardShapes(players: number, movesPerTurn: number, rounds: number): BoardShape[] {
	const total = players * movesPerTurn * rounds;
	const shapes: BoardShape[] = [];
	for (let rows = LIMITS.minSide; rows <= LIMITS.maxSide; rows++) {
		if (total % rows !== 0) continue;
		const cols = total / rows;
		if (cols < LIMITS.minSide || cols > LIMITS.maxSide) continue;
		if (Math.max(rows, cols) / Math.min(rows, cols) > LIMITS.maxAspect) continue;
		shapes.push({ rows, cols });
	}
	return shapes;
}

/**
 * Step a board side from `value` in `direction` until rows x cols divides by the player count,
 * as the legacy arrow-key nudging did. Returns the original value if no side in range works.
 */
export function nudgeSide(
	value: number,
	other: number,
	players: number,
	direction: 1 | -1
): number {
	for (let v = value; v >= LIMITS.minSide && v <= LIMITS.maxSide; v += direction) {
		if ((v * other) % players === 0) return v;
	}
	return value;
}

export function validateConfig(config: GameConfig, players: number): Result<GameConfig> {
	const { rows, cols, movesPerTurn, cellsToScore, lineBonus } = config;
	const ints = { rows, cols, movesPerTurn, cellsToScore, lineBonus, players };
	for (const [name, v] of Object.entries(ints)) {
		if (!Number.isInteger(v)) return fail(`${name} must be a whole number`);
	}
	if (players < LIMITS.minPlayers || players > LIMITS.maxPlayers)
		return fail(`Players must be between ${LIMITS.minPlayers} and ${LIMITS.maxPlayers}`);
	if (
		rows < LIMITS.minSide ||
		rows > LIMITS.maxSide ||
		cols < LIMITS.minSide ||
		cols > LIMITS.maxSide
	)
		return fail(`Rows and columns must be between ${LIMITS.minSide} and ${LIMITS.maxSide}`);
	if (movesPerTurn < 1) return fail('Moves per turn must be at least 1');
	if (!isFair(rows, cols, players, movesPerTurn))
		return fail(
			'Every player must get the same number of moves: rows × columns must divide by players × moves per turn'
		);
	if (cellsToScore < 2 || cellsToScore > Math.max(rows, cols))
		return fail('Cells to score must be between 2 and the longer board side');
	if (lineBonus < 0 || lineBonus > LIMITS.maxBonus)
		return fail(`Line bonus must be between 0 and ${LIMITS.maxBonus}`);
	if (typeof config.autoEndTurn !== 'boolean' || typeof config.liveScore !== 'boolean')
		return fail('Room options must be true or false');
	return ok(config);
}

export function validateSeats(seats: Seat[], paletteSize: number): Result<Seat[]> {
	const marks = new Set<string>();
	const colors = new Set<number>();
	for (const s of seats) {
		if (!s.name.trim()) return fail('Every player needs a name');
		if (!s.mark.trim()) return fail('Every player needs a mark');
		if (marks.has(s.mark)) return fail('Marks must be different');
		if (!Number.isInteger(s.color) || s.color < 0 || s.color >= paletteSize)
			return fail('Unknown player colour');
		if (colors.has(s.color)) return fail('Colours must be different');
		if (s.kind !== 'human' && s.kind !== 'bot') return fail('Unknown player kind');
		if (s.kind === 'bot' && s.bot !== 'scatter' && s.bot !== 'greedy')
			return fail('Unknown bot level');
		marks.add(s.mark);
		colors.add(s.color);
	}
	return ok(seats);
}

/** Warn (but allow) when N exceeds the shorter side: then only one direction can score. */
export const cellsToScoreWarning = (config: GameConfig) =>
	config.cellsToScore > Math.min(config.rows, config.cols)
		? `With ${config.cellsToScore} to score, only lines along the longer side can score.`
		: undefined;

export interface Preset {
	id: string;
	name: string;
	blurb: string;
	players: number;
	config: Pick<GameConfig, 'rows' | 'cols' | 'movesPerTurn' | 'cellsToScore' | 'lineBonus'>;
}

/** GDD section 4 presets. Rounds are derived. */
export const PRESETS: Preset[] = [
	{
		id: 'warm-up',
		name: 'Warm-up',
		blurb: 'A small board to learn runs and blocks.',
		players: 2,
		config: { rows: 6, cols: 6, movesPerTurn: 2, cellsToScore: 3, lineBonus: 6 }
	},
	{
		id: 'blitz',
		name: 'Blitz',
		blurb: 'Four big turns each. Over in minutes.',
		players: 2,
		config: { rows: 5, cols: 8, movesPerTurn: 5, cellsToScore: 3, lineBonus: 8 }
	},
	{
		id: 'classic',
		name: 'Classic',
		blurb: 'The family favourite: build and block.',
		players: 2,
		config: { rows: 8, cols: 12, movesPerTurn: 4, cellsToScore: 3, lineBonus: 12 }
	},
	{
		id: 'long-lines',
		name: 'Long lines',
		blurb: 'Four in a row to score. Lines win big.',
		players: 2,
		config: { rows: 8, cols: 14, movesPerTurn: 7, cellsToScore: 4, lineBonus: 12 }
	},
	{
		id: 'party',
		name: 'Party',
		blurb: 'Four players, plenty of chaos.',
		players: 4,
		config: { rows: 10, cols: 12, movesPerTurn: 5, cellsToScore: 3, lineBonus: 10 }
	},
	{
		id: 'marathon',
		name: 'Marathon',
		blurb: 'A long, deep game on a big board.',
		players: 3,
		config: { rows: 12, cols: 18, movesPerTurn: 6, cellsToScore: 4, lineBonus: 18 }
	}
];

/**
 * The preset's board for another player count: unchanged when already fair, else the fair
 * shape nearest in cell count and aspect ratio, keeping moves per turn, N and bonus.
 */
export function adaptPreset(preset: Preset, players: number): Preset['config'] {
	const { rows, cols, movesPerTurn } = preset.config;
	if (isFair(rows, cols, players, movesPerTurn)) return preset.config;
	const target = rows * cols;
	const aspect = cols / rows;
	let best: BoardShape | undefined;
	let bestCost = Infinity;
	for (let r = LIMITS.minSide; r <= LIMITS.maxSide; r++) {
		for (let c = LIMITS.minSide; c <= LIMITS.maxSide; c++) {
			if (!isFair(r, c, players, movesPerTurn)) continue;
			if (Math.max(r, c) / Math.min(r, c) > LIMITS.maxAspect) continue;
			const cost = Math.abs(r * c - target) / target + Math.abs(c / r - aspect);
			if (cost < bestCost) {
				bestCost = cost;
				best = { rows: r, cols: c };
			}
		}
	}
	return best ? { ...preset.config, ...best } : preset.config;
}
