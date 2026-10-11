import { parseRecord, serialize, type GameRecord, type GameState } from '@sttt/engine';
import { PALETTE_SIZE } from './palette.ts';

/**
 * Local persistence (GDD section 9): the game in progress lives in localStorage and is saved on
 * every change; finished games go to an IndexedDB history. Storage can be unavailable (private
 * windows, blocked site data), so every access degrades to "nothing saved" instead of failing.
 */

const CURRENT_KEY = 'sttt:game';
const SETUP_KEY = 'sttt:setup';

function read(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function write(key: string, value: string | null): boolean {
	try {
		if (value === null) localStorage.removeItem(key);
		else localStorage.setItem(key, value);
		return true;
	} catch {
		return false;
	}
}

export function loadCurrent(): GameState | undefined {
	const raw = read(CURRENT_KEY);
	if (!raw) return undefined;
	const parsed = parseRecord(raw, PALETTE_SIZE);
	return parsed.ok ? parsed.value : undefined;
}

export const saveCurrent = (record: GameRecord) => write(CURRENT_KEY, serialize(record));
export const clearCurrent = () => write(CURRENT_KEY, null);

/** The last setup used, to prefill the next one. Shape is checked by the setup screen. */
export function loadSetup<T>(): Partial<T> | undefined {
	const raw = read(SETUP_KEY);
	if (!raw) return undefined;
	try {
		return JSON.parse(raw) as Partial<T>;
	} catch {
		return undefined;
	}
}
export const saveSetup = (value: unknown) => write(SETUP_KEY, JSON.stringify(value));

export function readPref(key: string): string | null {
	return read(`sttt:${key}`);
}
export function writePref(key: string, value: string | null) {
	write(`sttt:${key}`, value);
}

/* ---------- History (IndexedDB) ---------- */

const DB = 'sttt';
const STORE = 'games';
export const HISTORY_LIMIT = 200;

function open(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'));
		const req = indexedDB.open(DB, 1);
		req.onupgradeneeded = () => {
			const store = req.result.createObjectStore(STORE, { keyPath: 'id' });
			store.createIndex('finishedAt', 'finishedAt');
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T> | void) {
	return open().then(
		(db) =>
			new Promise<T | undefined>((resolve, reject) => {
				const t = db.transaction(STORE, mode);
				const req = run(t.objectStore(STORE));
				t.oncomplete = () => resolve(req ? req.result : undefined);
				t.onerror = () => reject(t.error);
			})
	);
}

/** Save a finished game, keeping only the newest HISTORY_LIMIT. */
export async function addToHistory(record: GameRecord): Promise<void> {
	try {
		await tx('readwrite', (s) => s.put(structuredClone(record)));
		const all = await listHistory();
		const extra = all.slice(HISTORY_LIMIT);
		if (extra.length) await tx('readwrite', (s) => extra.forEach((r) => s.delete(r.id)));
	} catch {
		// History is a convenience; the game itself is unaffected.
	}
}

/** Finished games, newest first. Records that fail validation are skipped. */
export async function listHistory(): Promise<GameRecord[]> {
	try {
		const all = (await tx<GameRecord[]>('readonly', (s) => s.getAll())) ?? [];
		return all
			.filter((r) => parseRecord(r, PALETTE_SIZE).ok)
			.sort((a, b) => (b.finishedAt ?? '').localeCompare(a.finishedAt ?? ''));
	} catch {
		return [];
	}
}
