<script lang="ts">
	import { rank } from '@sttt/engine';
	import { resolve } from '$app/paths';
	import { exportRecord } from '../files.ts';
	import type { Game } from '../game.svelte.ts';
	import { colorOf, playerVars } from '../palette.ts';
	import Confetti from './Confetti.svelte';
	import Dialog from './Dialog.svelte';

	/** Final standings with the GDD tie-breaks, and what to do next (GDD section 7). */
	let { game, open = $bindable(false) }: { game: Game; open?: boolean } = $props();

	const order = $derived(rank(game.scores));
	const winners = $derived(order.filter((o) => o.place === 1).map((o) => game.seats[o.seat]!));
	const headline = $derived(
		winners.length === 1
			? `${winners[0]!.mark} ${winners[0]!.name} wins!`
			: `Shared win: ${winners.map((w) => w.name).join(' & ')}`
	);
	const ordinal = (n: number) => ['1st', '2nd', '3rd'][n - 1] ?? `${n}th`;
</script>

{#if open && winners[0]}
	<Confetti mark={winners[0].mark} color={colorOf(winners[0].color)} />
{/if}

<Dialog bind:open title="Game over">
	<p class="headline">{headline}</p>
	<table>
		<thead>
			<tr>
				<th scope="col"><span class="visually-hidden">Place</span></th>
				<th scope="col">Player</th>
				<th scope="col" class="n">Total</th>
				<th scope="col" class="n">Runs</th>
				<th scope="col" class="n">Bonus</th>
				<th scope="col" class="n" title="Longest single run">Longest</th>
			</tr>
		</thead>
		<tbody>
			{#each order as o (o.seat)}
				{@const seat = game.seats[o.seat]!}
				{@const s = game.scores[o.seat]!}
				<tr style={playerVars(seat.color)} class:winner={o.place === 1}>
					<td class="place">{ordinal(o.place)}</td>
					<th scope="row"><span class="chip">{seat.mark}</span> {seat.name}</th>
					<td class="n total">{s.total}</td>
					<td class="n">{s.runPoints}</td>
					<td class="n">{s.bonus}</td>
					<td class="n">{s.longestRun}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#snippet footer()}
		<button class="btn" onclick={() => exportRecord(game.state.record)}>Save to file</button>
		<a class="btn" href={resolve('/setup')}>New game…</a>
		<button class="btn" onclick={() => (open = false)}>See scoring on board</button>
		<button class="btn primary" onclick={() => game.rematch()}>Rematch</button>
	{/snippet}
</Dialog>

<style>
	.headline {
		margin: 0 0 var(--space-4);
		font-size: 22px;
		font-weight: 800;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th,
	td {
		padding: 6px 8px;
		text-align: left;
		border-bottom: 1px solid var(--border);
	}
	thead th {
		font-size: 12px;
		color: var(--fg-muted);
		font-weight: 700;
	}
	.n {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.total {
		font-weight: 800;
		font-size: 17px;
	}
	.place {
		color: var(--fg-muted);
		font-weight: 700;
	}
	.winner .place {
		color: var(--bonus);
	}
	.chip {
		display: inline-grid;
		place-items: center;
		width: 28px;
		height: 28px;
		margin-right: 4px;
		border-radius: var(--radius);
		background: var(--player);
		font-family: var(--emoji);
	}
</style>
