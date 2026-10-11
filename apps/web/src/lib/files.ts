import {
	parseRecord,
	RECORD_EXTENSION,
	serialize,
	type GameRecord,
	type GameState,
	type Result
} from '@sttt/engine';
import { PALETTE_SIZE } from './palette.ts';

/** Save a game as a .sttt.json file (GDD section 9). */
export function exportRecord(record: GameRecord) {
	const date = record.createdAt.slice(0, 10);
	const names = record.seats.map((s) => s.name.replace(/[^\w-]+/g, '')).join('-vs-');
	const blob = new Blob([serialize(record)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `sttt-${date}-${names || 'game'}${RECORD_EXTENSION}`;
	document.body.append(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Read and check a game file chosen by the player. */
export async function importRecord(file: File): Promise<Result<GameState>> {
	if (file.size > 1_000_000)
		return { ok: false, error: 'This file is too large to be a saved game' };
	return parseRecord(await file.text(), PALETTE_SIZE);
}
