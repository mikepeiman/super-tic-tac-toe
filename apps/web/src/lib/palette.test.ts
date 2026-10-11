import { describe, expect, it } from 'vitest';
import { cellTint, PLAYER_COLORS, textOn } from './palette.ts';

describe('palette', () => {
	it('has eight distinct player colours', () => {
		expect(new Set(PLAYER_COLORS.map((c) => c.hex)).size).toBe(8);
	});

	it('picks the more readable text colour', () => {
		expect(textOn('#000000')).toBe('#ffffff');
		expect(textOn('#ffffff')).toBe('#000000');
		expect(textOn('#d9971f')).toBe('#000000');
	});

	it('reproduces the legacy board tint formula', () => {
		// Legacy: hue = 60 / rows * row + 210; alpha = (col + 1) / 200 / (cols / 100).
		expect(cellTint(0, 0, 8, 12)).toBe('hsl(210.0 50% 50% / 0.04)');
		expect(cellTint(4, 11, 8, 12)).toBe('hsl(240.0 50% 50% / 0.50)');
	});
});
