/**
 * Player identity colours (GDD section 8). Eight hues spaced for distinctness; the mark always
 * identifies the owner too, so colour is never the only cue. The first two match the legacy
 * two-player red and teal.
 */
export const PLAYER_COLORS = [
	{ name: 'Ember', hex: '#c94a44' },
	{ name: 'Lagoon', hex: '#2fa8a3' },
	{ name: 'Amber', hex: '#d9971f' },
	{ name: 'Violet', hex: '#8466d4' },
	{ name: 'Leaf', hex: '#4f9a3f' },
	{ name: 'Sky', hex: '#3584d8' },
	{ name: 'Rose', hex: '#d0588f' },
	{ name: 'Stone', hex: '#7d8597' }
] as const;

export const PALETTE_SIZE = PLAYER_COLORS.length;

export const colorOf = (index: number) => PLAYER_COLORS[index]?.hex ?? PLAYER_COLORS[0].hex;

function luminance(hex: string): number {
	const [r, g, b] = [1, 3, 5].map((i) => {
		const c = parseInt(hex.slice(i, i + 2), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	}) as [number, number, number];
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** Black or white, whichever reads better on the colour. */
export function textOn(hex: string): string {
	const l = luminance(hex);
	return contrast(l, 0) >= contrast(l, 1) ? '#000000' : '#ffffff';
}

/** CSS custom properties for a seat's colour. */
export const playerVars = (index: number) => {
	const hex = colorOf(index);
	return `--player: ${hex}; --player-fg: ${textOn(hex)};`;
};

/** The four scoring directions: label, short label and colour role (app.css). */
export const DIRECTION_META = [
	{ label: 'Horizontal', short: 'Across', color: 'var(--dir-h)' },
	{ label: 'Vertical', short: 'Down', color: 'var(--dir-v)' },
	{ label: 'Diagonal down-left', short: 'Diagonal ↙', color: 'var(--dir-dl)' },
	{ label: 'Diagonal down-right', short: 'Diagonal ↘', color: 'var(--dir-dr)' }
] as const;

/**
 * The legacy board tint: hue shifts from blue towards violet down the rows and opacity rises
 * across the columns, which helps track rows and columns on big boards.
 */
export function cellTint(row: number, col: number, rows: number, cols: number): string {
	const hue = (60 / rows) * row + 210;
	const alpha = ((col + 1) / (2 * cols)).toFixed(2);
	return `hsl(${hue.toFixed(1)} 50% 50% / ${alpha})`;
}
