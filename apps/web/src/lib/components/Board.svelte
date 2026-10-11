<script lang="ts">
	/* eslint-disable svelte/prefer-svelte-reactivity -- Maps and Sets here are rebuilt inside $derived, never mutated afterwards. */
	import { EMPTY, finalFill, scoringRuns } from '@sttt/engine';
	import { CASCADE_MS, type Game } from '../game.svelte.ts';
	import { cellTint, colorOf, DIRECTION_META, textOn } from '../palette.ts';
	import { prefs } from '../prefs.svelte.ts';

	/**
	 * The board (GDD sections 7-8): an ARIA grid of cell buttons with a roving tabindex.
	 * Cells are square and as large as the space allows, sized by container query units; below
	 * 28 px the board keeps that minimum and the area scrolls instead.
	 */
	let {
		game,
		/** After the game: which direction's runs to outline, or -1 for all. */
		scoringDir = -1,
		/** After the game: only this seat's runs, or -1 for everyone. */
		scoringSeat = -1
	}: { game: Game; scoringDir?: number; scoringSeat?: number } = $props();

	const gs = $derived(game.state);
	const config = $derived(gs.record.config);
	const rows = $derived(config.rows);
	const cols = $derived(config.cols);
	const seats = $derived(gs.record.seats);
	const pending = $derived(new Set(gs.record.pending));
	const recent = $derived(new Set(gs.finished ? [] : (gs.record.turns.at(-1)?.cells ?? [])));

	/** Final-turn cells and their cascade delays. */
	const cascade = $derived.by(() => {
		const fill = game.phase === 'cascade' ? finalFill(gs) : undefined;
		const map = new Map<number, number>();
		fill?.cells.forEach((c, i) => map.set(c, (i * CASCADE_MS) / Math.max(1, fill.cells.length)));
		return map;
	});

	/** Run outlines: during the tally, the direction being revealed; afterwards, the filter. */
	const highlight = $derived.by(() => {
		const runs = new Map<number, string>();
		const bonus = new Set<number>();
		let dir: number | undefined;
		if (game.phase === 'tally') dir = game.revealed - 1;
		else if (game.phase === 'done') dir = scoringDir;
		if (dir === undefined || (game.phase === 'tally' && dir < 0)) return { runs, bonus };
		const all = scoringRuns(gs.owners, config);
		for (const run of all.runs) {
			if (dir !== -1 && run.dir !== dir) continue;
			if (scoringSeat !== -1 && run.seat !== scoringSeat) continue;
			for (const c of run.cells) runs.set(c, DIRECTION_META[run.dir]!.color);
		}
		for (const line of all.bonusLines) {
			if (dir !== -1 && line.dir !== dir) continue;
			if (scoringSeat !== -1 && gs.owners[line.cells[0]!] !== scoringSeat) continue;
			line.cells.forEach((c) => bonus.add(c));
		}
		return { runs, bonus };
	});

	let focusIndex = $state(0);
	let gridEl = $state<HTMLElement>();

	function label(i: number): string {
		const r = Math.floor(i / cols) + 1;
		const c = (i % cols) + 1;
		const owner = gs.owners[i]!;
		if (owner === EMPTY) return `Row ${r}, column ${c}, empty`;
		const seat = seats[owner]!;
		const status = pending.has(i) ? 'pending' : 'locked';
		return `Row ${r}, column ${c}, ${seat.name} ${seat.mark}, ${status}`;
	}

	function move(i: number) {
		focusIndex = Math.max(0, Math.min(gs.totalCells - 1, i));
		gridEl?.querySelector<HTMLElement>(`[data-cell="${focusIndex}"]`)?.focus();
	}

	function onkeydown(event: KeyboardEvent) {
		const i = focusIndex;
		const r = Math.floor(i / cols);
		const keys: Record<string, number> = {
			ArrowRight: i % cols < cols - 1 ? i + 1 : i,
			ArrowLeft: i % cols > 0 ? i - 1 : i,
			ArrowDown: r < rows - 1 ? i + cols : i,
			ArrowUp: r > 0 ? i - cols : i,
			Home: event.ctrlKey ? 0 : r * cols,
			End: event.ctrlKey ? gs.totalCells - 1 : r * cols + cols - 1
		};
		if (event.key in keys) {
			event.preventDefault();
			move(keys[event.key]!);
		}
	}

	const current = $derived(seats[gs.currentSeat]!);
	const frame = $derived(gs.finished ? 'var(--border)' : colorOf(current.color));
</script>

<div class="wrap" style:--rows={rows} style:--cols={cols} style:--size={prefs.boardSize / 100}>
	<div
		bind:this={gridEl}
		class="board"
		class:can-act={game.canAct}
		role="grid"
		tabindex="-1"
		aria-label={`Game board, ${rows} rows by ${cols} columns`}
		aria-rowcount={rows}
		aria-colcount={cols}
		style:--frame={frame}
		style:--preview={JSON.stringify(current.mark)}
		{onkeydown}
	>
		{#each { length: rows }, r (r)}
			<div role="row" class="row" aria-rowindex={r + 1}>
				{#each { length: cols }, c (c)}
					{@const i = r * cols + c}
					{@const owner = gs.owners[i]!}
					{@const color = owner === EMPTY ? undefined : colorOf(seats[owner]!.color)}
					<button
						type="button"
						role="gridcell"
						class="cell"
						class:empty={owner === EMPTY}
						class:pending={pending.has(i)}
						class:recent={recent.has(i)}
						class:cascade={cascade.has(i)}
						class:run={highlight.runs.has(i)}
						class:bonus={highlight.bonus.has(i)}
						data-cell={i}
						aria-colindex={c + 1}
						aria-label={label(i)}
						tabindex={focusIndex === i ? 0 : -1}
						style:--tint={cellTint(r, c, rows, cols)}
						style:--owner={color}
						style:--owner-fg={color ? textOn(color) : undefined}
						style:--delay={cascade.has(i) ? `${cascade.get(i)}ms` : undefined}
						style:--run={highlight.runs.get(i)}
						onfocus={() => (focusIndex = i)}
						onclick={() => game.activate(i)}
					>
						{#if owner !== EMPTY}
							<span class="mark" aria-hidden="true">{seats[owner]!.mark}</span>
						{/if}
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.wrap {
		container-type: size;
		width: 100%;
		height: 100%;
		min-height: 0;
		overflow: auto;
		display: grid;
		place-items: center;
	}

	.board {
		--pad: 6px;
		--inner: max(
			calc(var(--cols) * 28px),
			calc(min(100cqw, 100cqh * var(--cols) / var(--rows)) * var(--size) - 2 * var(--pad) - 12px)
		);
		--cell: calc(var(--inner) / var(--cols));
		display: grid;
		grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
		grid-template-rows: repeat(var(--rows), minmax(0, 1fr));
		gap: 1px;
		width: var(--inner);
		aspect-ratio: var(--cols) / var(--rows);
		padding: var(--pad);
		border: 6px solid var(--frame);
		background: var(--cell-gap);
		transition: border-color 0.4s;
		content-visibility: auto;
		contain-intrinsic-size: auto 600px auto 400px;
	}

	.row {
		display: contents;
	}

	.cell {
		position: relative;
		display: grid;
		place-items: center;
		min-width: 0;
		min-height: 0;
		padding: 0;
		border: 0;
		background: var(--owner, var(--tint));
		color: var(--owner-fg, var(--fg));
		font-family: var(--emoji);
		font-size: calc(var(--cell) * 0.58);
		line-height: 1;
		cursor: default;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.cell:focus-visible {
		z-index: 1;
		outline: 3px solid var(--frame);
		outline-offset: -3px;
	}

	.can-act .cell.empty,
	.can-act .cell.pending {
		cursor: pointer;
	}

	/* Preview of the active player's mark on empty cells. */
	.can-act .cell.empty:hover::after,
	.can-act .cell.empty:focus-visible::after {
		content: var(--preview);
		opacity: 0.35;
	}
	.can-act .cell.empty:hover {
		outline: 3px solid var(--frame);
		outline-offset: -4px;
	}

	.mark {
		display: block;
		animation: pop 0.12s ease-out;
	}

	/* Pending marks can still be taken back: dashed inner outline. Locked marks are solid. */
	.cell.pending::before {
		content: '';
		position: absolute;
		inset: 3px;
		border: 2px dashed var(--owner-fg);
		border-radius: 2px;
		opacity: 0.85;
	}

	/* The previous turn's marks, so the next player sees what changed. */
	.cell.recent::before {
		content: '';
		position: absolute;
		top: 3px;
		right: 3px;
		width: max(4px, calc(var(--cell) * 0.1));
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--owner-fg);
		opacity: 0.7;
	}

	.cell.cascade .mark,
	.cell.cascade {
		animation: cascade 0.25s ease-out backwards;
		animation-delay: var(--delay);
	}

	.cell.run::after {
		content: '';
		position: absolute;
		inset: 1px;
		border: 3px solid var(--run);
		border-radius: 2px;
		pointer-events: none;
	}

	.cell.bonus {
		box-shadow:
			inset 0 0 0 3px var(--bonus),
			0 0 10px 1px var(--bonus);
		z-index: 1;
	}

	@keyframes pop {
		from {
			transform: scale(0.7);
		}
	}

	@keyframes cascade {
		from {
			transform: scale(0.4);
			opacity: 0;
			background: var(--tint);
		}
	}
</style>
