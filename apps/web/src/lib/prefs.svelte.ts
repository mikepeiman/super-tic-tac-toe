import { readPref, writePref } from './storage.ts';

/**
 * Per-device display preferences (GDD section 7). They never affect other players or the game
 * record. The colour scheme follows the dark-mode-toggle pattern: no stored value means
 * "follow the system", and app.html applies a stored override before first paint.
 */
export type Scheme = 'system' | 'light' | 'dark';
export type Motion = 'system' | 'reduce';

class Prefs {
	scheme = $state<Scheme>('system');
	motion = $state<Motion>('system');
	/** Board size as a percentage of the space available to it. */
	boardSize = $state(100);
	sound = $state(true);
	haptics = $state(true);

	load() {
		const scheme = readPref('color-scheme');
		this.scheme = scheme === 'light' || scheme === 'dark' ? scheme : 'system';
		this.motion = readPref('motion') === 'reduce' ? 'reduce' : 'system';
		const size = Number(readPref('board-size'));
		this.boardSize = size >= 50 && size <= 100 ? size : 100;
		this.sound = readPref('sound') !== 'off';
		this.haptics = readPref('haptics') !== 'off';
		this.apply();
	}

	save() {
		writePref('color-scheme', this.scheme === 'system' ? null : this.scheme);
		writePref('motion', this.motion === 'reduce' ? 'reduce' : null);
		writePref('board-size', this.boardSize === 100 ? null : String(this.boardSize));
		writePref('sound', this.sound ? null : 'off');
		writePref('haptics', this.haptics ? null : 'off');
		this.apply();
	}

	apply() {
		if (typeof document === 'undefined') return;
		const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
		if (meta) meta.content = this.scheme === 'system' ? 'light dark' : this.scheme;
		if (this.motion === 'reduce') document.documentElement.dataset.motion = 'reduce';
		else delete document.documentElement.dataset.motion;
	}

	/** True when animations should be skipped, by preference or by the system setting. */
	get reducedMotion() {
		if (this.motion === 'reduce') return true;
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
}

export const prefs = new Prefs();
