import type { Seat } from './types.ts';

/** The legacy app's default marks, in seat order (GDD section 8). */
export const DEFAULT_MARKS = ['🔥', '🦄', '⚔️', '🐅', '🌈', '❄️', '🏔️', '🎁'] as const;

/** Seats for a new game: Player 1..n with the default marks and colours in order. */
export function defaultSeats(count: number, bots: number[] = []): Seat[] {
	return Array.from({ length: count }, (_, i) => {
		const bot = bots.includes(i);
		return {
			name: bot ? `Bot ${i + 1}` : `Player ${i + 1}`,
			mark: DEFAULT_MARKS[i % DEFAULT_MARKS.length]!,
			color: i,
			kind: bot ? 'bot' : 'human',
			...(bot ? { bot: 'greedy' as const } : {})
		};
	});
}
