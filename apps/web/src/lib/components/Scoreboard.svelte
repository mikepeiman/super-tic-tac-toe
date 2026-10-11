<script lang="ts">
	import { DIRECTIONS } from '@sttt/engine';
	import type { Game } from '../game.svelte.ts';
	import { DIRECTION_META, playerVars } from '../palette.ts';
	import CountUp from './CountUp.svelte';
	import DirectionIcon from './DirectionIcon.svelte';

	/**
	 * One card per player: name, mark, total and the four direction subtotals (GDD section 7).
	 * The active player's card is raised. While scores are hidden the numbers show "?".
	 */
	let { game, onedit }: { game: Game; onedit: (seat: number) => void } = $props();

	const scores = $derived(game.visibleScores);
	const revealed = $derived(game.revealed);
</script>

<ol class="scoreboard" aria-label="Scores">
	{#each game.seats as seat, i (i)}
		{@const score = scores?.[i]}
		{@const active = !game.state.finished && game.state.currentSeat === i}
		{@const shown = score?.byDirection.slice(0, revealed) ?? []}
		{@const total = shown.reduce((n, d) => n + d.points + d.bonus, 0)}
		<li
			class="card"
			class:active
			style={playerVars(seat.color)}
			aria-current={active ? 'true' : undefined}
		>
			<div class="head">
				<span class="mark" aria-hidden="true">{seat.mark}</span>
				<span class="name">{seat.name}</span>
				{#if seat.kind === 'bot'}<span class="badge" title="Computer player"
						>{seat.bot === 'greedy' ? 'Bot' : 'Easy bot'}</span
					>{/if}
				<span class="total" aria-label={score ? `${total} points` : 'Score hidden'}>
					{#if score}<CountUp value={total} />{:else}?{/if}
				</span>
				<button class="edit" aria-label={`Edit ${seat.name}`} onclick={() => onedit(i)}>
					<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
						<path
							d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4"
							stroke="currentColor"
							stroke-width="2"
							fill="none"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</div>
			<ul class="dirs">
				{#each DIRECTIONS as _, d (d)}
					{@const ds = score?.byDirection[d]}
					{@const visible = !!ds && d < revealed}
					<li style:--dir={DIRECTION_META[d]!.color} title={DIRECTION_META[d]!.label}>
						<DirectionIcon dir={d} />
						<span class="visually-hidden">{DIRECTION_META[d]!.label}:</span>
						<span class="num">{visible ? ds.points + ds.bonus : '·'}</span>
						{#if visible && ds.bonus > 0}<span class="bonus" title="Line bonus">+{ds.bonus}</span
							>{/if}
					</li>
				{/each}
			</ul>
			{#if active}<span class="visually-hidden">To play</span>{/if}
		</li>
	{/each}
</ol>

<style>
	.scoreboard {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.card {
		border: 2px solid transparent;
		border-radius: var(--radius);
		background: var(--surface);
		box-shadow: var(--shadow);
		overflow: hidden;
		transition:
			transform 0.2s,
			border-color 0.2s;
	}
	.card.active {
		border-color: var(--player);
		transform: translateX(6px);
	}

	.head {
		display: grid;
		grid-template-columns: auto 1fr auto auto auto;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-1) var(--space-1) var(--space-1) var(--space-2);
		background: var(--player);
		color: var(--player-fg);
	}
	.mark {
		font-family: var(--emoji);
		font-size: 22px;
	}
	.name {
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.badge {
		font-size: 11px;
		font-weight: 700;
		padding: 1px 6px;
		border-radius: 99px;
		background: color-mix(in srgb, var(--player-fg) 22%, transparent);
	}
	.total {
		min-width: 2.5ch;
		padding: 0 var(--space-2);
		border-radius: var(--radius);
		background: var(--surface);
		color: var(--fg);
		font-size: 20px;
		font-weight: 800;
		text-align: center;
	}
	.edit {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border: 0;
		border-radius: var(--radius);
		background: transparent;
		color: inherit;
		cursor: pointer;
		&:hover {
			background: color-mix(in srgb, var(--player-fg) 18%, transparent);
		}
	}

	.dirs {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		margin: 0;
		padding: var(--space-1) var(--space-2);
		list-style: none;
		li {
			display: flex;
			align-items: center;
			gap: 3px;
			color: var(--dir);
			font-size: 13px;
			font-weight: 700;
		}
		.num {
			color: var(--fg);
		}
		.bonus {
			color: var(--bonus);
			font-size: 11px;
		}
	}

	@media (max-width: 899px) {
		.scoreboard {
			flex-direction: row;
			overflow-x: auto;
			padding-bottom: var(--space-1);
		}
		.card {
			flex: 0 0 auto;
			min-width: 168px;
		}
		.card.active {
			transform: translateY(-3px);
		}
	}
</style>
