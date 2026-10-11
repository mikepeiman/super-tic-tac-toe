import { prefs } from './prefs.svelte.ts';

/**
 * Small synthesized sounds (GDD section 8) so the app ships no audio files. Each player's pop
 * is pitched slightly differently. Everything is quiet and skipped when sound is off.
 */
let ctx: AudioContext | undefined;

function audio(): AudioContext | undefined {
	if (!prefs.sound || typeof AudioContext === 'undefined') return undefined;
	ctx ??= new AudioContext();
	if (ctx.state === 'suspended') void ctx.resume();
	return ctx;
}

function tone(
	freq: number,
	start: number,
	duration: number,
	volume = 0.06,
	type: OscillatorType = 'sine'
) {
	const a = audio();
	if (!a) return;
	const t = a.currentTime + start;
	const osc = a.createOscillator();
	const gain = a.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, t);
	gain.gain.setValueAtTime(0.0001, t);
	gain.gain.exponentialRampToValueAtTime(volume, t + 0.01);
	gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
	osc.connect(gain).connect(a.destination);
	osc.start(t);
	osc.stop(t + duration + 0.02);
}

const SEAT_PITCH = [523, 587, 659, 698, 784, 880, 988, 1047];

export const sounds = {
	place(seat: number) {
		tone(SEAT_PITCH[seat % SEAT_PITCH.length]!, 0, 0.09, 0.05, 'triangle');
		if (prefs.haptics) navigator.vibrate?.(8);
	},
	takeBack() {
		tone(330, 0, 0.07, 0.035, 'triangle');
	},
	turn() {
		tone(660, 0, 0.12, 0.04);
		tone(880, 0.09, 0.16, 0.04);
		if (prefs.haptics) navigator.vibrate?.([10, 40, 10]);
	},
	tick() {
		tone(1200, 0, 0.03, 0.02, 'square');
	},
	fanfare() {
		[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, 0.05, 'triangle'));
	},
	deny() {
		tone(180, 0, 0.08, 0.03, 'sawtooth');
	}
};
