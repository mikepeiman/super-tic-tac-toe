import type { Direction } from './types.ts';

export interface Line {
	dir: number;
	cells: number[];
	/** Bonus for owning every cell of this line (GDD section 3). */
	bonus: number;
}

export interface Topology {
	rows: number;
	cols: number;
	size: number;
	lines: Line[];
	/** For each cell, the indexes of the lines through it (one per direction). */
	cellLines: number[][];
}

const STEPS: Record<Direction, [number, number]> = {
	horizontal: [0, 1],
	vertical: [1, 0],
	diagonalDownLeft: [1, -1],
	diagonalDownRight: [1, 1]
};

/**
 * Bonus for a fully owned line of length `len`.
 * The expression matches the legacy app exactly, rounding the partial bonus up.
 */
export function lineBonusFor(len: number, rows: number, cols: number, bonus: number): number {
	const longer = rows > cols ? rows : cols;
	const shorter = rows < cols ? rows : cols;
	if (len >= longer) return bonus;
	if (len >= shorter) return Math.ceil(bonus / (longer / shorter));
	return 0;
}

const cache = new Map<string, Topology>();

/** Every scoring line of an R x C board, grouped by direction. Cached per shape and bonus. */
export function topology(rows: number, cols: number, bonus: number): Topology {
	const key = `${rows}x${cols}:${bonus}`;
	const hit = cache.get(key);
	if (hit) return hit;

	const lines: Line[] = [];
	const inBoard = (r: number, c: number) => r >= 0 && r < rows && c >= 0 && c < cols;
	(Object.keys(STEPS) as Direction[]).forEach((name, dir) => {
		const [dr, dc] = STEPS[name];
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				// A line starts at a cell whose predecessor is off the board.
				if (inBoard(r - dr, c - dc)) continue;
				const cells: number[] = [];
				for (let rr = r, cc = c; inBoard(rr, cc); rr += dr, cc += dc) cells.push(rr * cols + cc);
				lines.push({ dir, cells, bonus: lineBonusFor(cells.length, rows, cols, bonus) });
			}
		}
	});

	const cellLines: number[][] = Array.from({ length: rows * cols }, () => []);
	lines.forEach((line, i) => line.cells.forEach((cell) => cellLines[cell]!.push(i)));

	const result = { rows, cols, size: rows * cols, lines, cellLines };
	cache.set(key, result);
	return result;
}

export const rowOf = (cell: number, cols: number) => Math.floor(cell / cols);
export const colOf = (cell: number, cols: number) => cell % cols;
