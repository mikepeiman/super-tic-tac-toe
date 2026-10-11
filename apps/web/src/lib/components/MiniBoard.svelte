<script lang="ts">
	import { colorOf } from '../palette.ts';

	/**
	 * A small static board for the rules page. Rows are strings: '.' empty, 'A'-'H' a seat.
	 * `outline` lists cells (row-major) to outline in a direction or bonus colour.
	 */
	let {
		rows,
		marks = ['🔥', '🦄', '⚔️'],
		outline = [],
		outlineColor = 'var(--bonus)',
		label
	}: {
		rows: string[];
		marks?: string[];
		outline?: number[];
		outlineColor?: string;
		label: string;
	} = $props();

	const cols = $derived(rows[0]?.length ?? 0);
	const cells = $derived(rows.join('').split(''));
	const outlined = $derived(new Set(outline));
</script>

<div class="mini" style:--cols={cols} role="img" aria-label={label}>
	{#each cells as ch, i (i)}
		{@const seat = ch === '.' ? -1 : ch.charCodeAt(0) - 65}
		<span
			class:on={outlined.has(i)}
			style:--bg={seat < 0 ? undefined : colorOf(seat)}
			style:--o={outlineColor}>{seat < 0 ? '' : marks[seat]}</span
		>
	{/each}
</div>

<style>
	.mini {
		display: inline-grid;
		grid-template-columns: repeat(var(--cols), 30px);
		gap: 1px;
		padding: 3px;
		border: 3px solid var(--border);
		background: var(--cell-gap);
	}
	span {
		position: relative;
		display: grid;
		place-items: center;
		height: 30px;
		background: var(--bg, color-mix(in srgb, #3b6fd4 18%, var(--surface)));
		font-family: var(--emoji);
		font-size: 17px;
	}
	.on::after {
		content: '';
		position: absolute;
		inset: 1px;
		border: 3px solid var(--o);
	}
</style>
