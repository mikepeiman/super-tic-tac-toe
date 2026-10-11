<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { DIRECTIONS } from '@sttt/engine';
	import Board from '#lib/components/Board.svelte';
	import DirectionIcon from '#lib/components/DirectionIcon.svelte';
	import MenuDialog from '#lib/components/MenuDialog.svelte';
	import PlayerDialog from '#lib/components/PlayerDialog.svelte';
	import ResultsDialog from '#lib/components/ResultsDialog.svelte';
	import Scoreboard from '#lib/components/Scoreboard.svelte';
	import { Game } from '#lib/game.svelte.ts';
	import { DIRECTION_META, playerVars } from '#lib/palette.ts';
	import { loadCurrent } from '#lib/storage.ts';

	let game = $state<Game>();
	let loaded = $state(false);
	let menuOpen = $state(false);
	let resultsOpen = $state(false);
	let editing = $state<number | undefined>();
	let scoringDir = $state(-1);
	let scoringSeat = $state(-1);

	onMount(() => {
		const saved = loadCurrent();
		if (saved) {
			game = new Game(saved);
			resultsOpen = saved.finished;
		}
		loaded = true;
		return () => game?.destroy();
	});

	// Open the results when the end-of-game tally finishes.
	let lastPhase: string | undefined;
	$effect(() => {
		const phase = game?.phase;
		if (phase === 'done' && lastPhase && lastPhase !== 'done') resultsOpen = true;
		if (phase === 'play') resultsOpen = false;
		lastPhase = phase;
	});

	function onkeydown(event: KeyboardEvent) {
		if (!game || document.querySelector('dialog[open]')) return;
		const target = event.target as HTMLElement;
		if (target.matches('input, textarea, select')) return;
		if (event.ctrlKey || event.metaKey || event.altKey) return;
		if (event.key === 'Backspace') {
			event.preventDefault();
			game.takeBackLast();
		} else if (event.key === 'e' && !game.config.autoEndTurn) game.endTurn();
		else if (event.key === 't' && !game.config.liveScore && game.phase === 'play') game.tally();
	}

	const current = $derived(game?.current);
</script>

<svelte:head>
	<title>Super Tic-Tac-Toe</title>
</svelte:head>

<svelte:window {onkeydown} />

{#if game && current}
	{@const s = game.state}
	<div class="screen" style={s.finished ? undefined : playerVars(current.color)}>
		<header class="status">
			<h1 class="visually-hidden">Super Tic-Tac-Toe game</h1>
			{#if s.finished}
				<div class="who done"><span>Game over</span></div>
			{:else}
				<div class="who" aria-live="polite">
					<span class="mark" aria-hidden="true">{current.mark}</span>
					<span class="name">{current.name}</span>
					{#if game.botThinking}<span class="thinking">is thinking…</span>{/if}
				</div>
			{/if}
			<dl class="counts">
				{#if !s.finished}
					<div>
						<dt><span class="long">Moves left this turn</span><span class="short">Left</span></dt>
						<dd class="num" data-testid="moves-left">{s.movesLeftInTurn}</dd>
					</div>
				{/if}
				<div>
					<dt><span class="long">Moves played</span><span class="short">Played</span></dt>
					<dd class="num">
						<span data-testid="moves-played">{s.movesPlayed}</span><small> of {s.totalCells}</small>
					</dd>
				</div>
				<div class="round">
					<dt>Round</dt>
					<dd class="num">{s.round}<small> of {s.rounds}</small></dd>
				</div>
			</dl>
			<button class="btn ghost menu" onclick={() => (menuOpen = true)} aria-label="Menu">
				<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"
					><path
						d="M4 7h16M4 12h16M4 17h16"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/></svg
				>
				<span class="label">Menu</span>
			</button>
		</header>

		<aside class="scores">
			<Scoreboard {game} onedit={(i) => (editing = i)} />
		</aside>

		<main class="board-area">
			<Board {game} {scoringDir} {scoringSeat} />
			<p class="visually-hidden" aria-live="polite">{game.announcement}</p>
			{#if game.handover !== undefined}
				{@const next = game.seats[game.handover]!}
				<div class="handover" style={playerVars(next.color)} role="status">
					<span aria-hidden="true">{next.mark}</span>
					{next.name}’s turn
				</div>
			{/if}
		</main>

		<nav class="actions" aria-label="Game actions">
			{#if game.phase === 'play'}
				{#if !game.config.autoEndTurn}
					<button
						class="btn primary"
						disabled={!game.canAct || s.movesLeftInTurn > 0}
						onclick={() => game?.endTurn()}
					>
						End turn
					</button>
				{/if}
				<button
					class="btn"
					disabled={!game.canAct || s.record.pending.length === 0}
					onclick={() => game?.takeBackLast()}
				>
					Take back
				</button>
				{#if !game.config.liveScore}
					<button class="btn" onclick={() => game?.tally()}>Tally scores</button>
				{/if}
			{:else if game.phase === 'cascade' || game.phase === 'tally'}
				<p class="tallying" aria-live="polite">
					{game.phase === 'cascade'
						? 'Filling the final turn…'
						: `Tallying ${DIRECTION_META[Math.max(0, game.revealed - 1)]!.label.toLowerCase()}…`}
				</p>
				<button class="btn" onclick={() => game?.skipTally()}>Skip</button>
			{:else}
				<button class="btn primary" onclick={() => (resultsOpen = true)}>Results</button>
				<fieldset class="filter">
					<legend>Show scoring</legend>
					<div class="chips">
						<label><input type="radio" bind:group={scoringDir} value={-1} /><span>All</span></label>
						{#each DIRECTIONS as _, d (d)}
							<label style:--dir={DIRECTION_META[d]!.color} title={DIRECTION_META[d]!.label}>
								<input type="radio" bind:group={scoringDir} value={d} />
								<span
									><DirectionIcon dir={d} /><span class="visually-hidden"
										>{DIRECTION_META[d]!.label}</span
									></span
								>
							</label>
						{/each}
					</div>
					<select bind:value={scoringSeat} aria-label="Player">
						<option value={-1}>Everyone</option>
						{#each game.seats as seat, i (i)}
							<option value={i}>{seat.mark} {seat.name}</option>
						{/each}
					</select>
				</fieldset>
			{/if}
		</nav>
	</div>

	<MenuDialog {game} bind:open={menuOpen} />
	<PlayerDialog {game} bind:seat={editing} />
	<ResultsDialog {game} bind:open={resultsOpen} />
{:else if loaded}
	<main class="empty">
		<h1>No game in progress</h1>
		<p>Start a new game, or load one you saved from the home screen.</p>
		<div>
			<a class="btn primary" href={resolve('/setup')}>New game</a>
			<a class="btn" href={resolve('/')}>Home</a>
		</div>
	</main>
{/if}

<style>
	.screen {
		display: grid;
		grid-template-areas:
			'status status status'
			'scores board actions';
		grid-template-columns: minmax(230px, 19vw) minmax(0, 1fr) minmax(150px, 13vw);
		grid-template-rows: auto minmax(0, 1fr);
		gap: var(--space-4);
		height: 100dvh;
		padding-bottom: var(--space-4);
	}

	.status {
		grid-area: status;
		display: flex;
		align-items: stretch;
		gap: var(--space-4);
		min-height: 56px;
		background: var(--surface);
		box-shadow: 0 0 10px 2px color-mix(in srgb, var(--player) 45%, transparent);
		transition: box-shadow 0.4s;
	}
	.who {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		min-width: min(19vw, 300px);
		padding: 0 var(--space-4);
		background: var(--player);
		color: var(--player-fg);
		font-size: 20px;
		font-weight: 800;
		transition: background-color 0.4s;
		&.done {
			background: var(--surface-2);
			color: var(--fg);
		}
	}
	.who .mark {
		font-family: var(--emoji);
		font-size: 28px;
	}
	.thinking {
		font-size: 14px;
		font-weight: 600;
		opacity: 0.85;
	}
	.counts {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		gap: var(--space-5);
		margin: 0;
		> div {
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			gap: var(--space-2);
		}
		dt {
			color: var(--fg-muted);
			font-size: 13px;
		}
		.short {
			display: none;
		}
		dd {
			display: flex;
			align-items: baseline;
			justify-content: center;
			gap: 3px;
			line-height: 2.2em;
			min-width: 2.6em;
			height: 2.2em;
			margin: 0;
			padding: 0 8px;
			outline: 2px solid var(--player);
			outline-offset: -4px;
			white-space: nowrap;
			font-weight: 800;
			font-size: 17px;
			small {
				font-weight: 600;
				color: var(--fg-muted);
				font-size: 12px;
			}
		}
	}
	.menu {
		align-self: center;
		margin-right: var(--space-3);
	}

	.scores {
		grid-area: scores;
		min-height: 0;
		overflow: auto;
		padding: var(--space-2) 0 var(--space-2) var(--space-4);
	}

	.board-area {
		grid-area: board;
		position: relative;
		min-height: 0;
		min-width: 0;
	}

	.handover {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-5);
		border-radius: var(--radius-lg);
		background: var(--player);
		color: var(--player-fg);
		font-size: 24px;
		font-weight: 800;
		box-shadow: var(--shadow);
		pointer-events: none;
		animation: banner 1.4s ease forwards;
		span {
			font-family: var(--emoji);
			font-size: 32px;
		}
	}
	@keyframes banner {
		0% {
			opacity: 0;
			scale: 0.9;
		}
		15%,
		75% {
			opacity: 1;
			scale: 1;
		}
		100% {
			opacity: 0;
		}
	}

	.actions {
		grid-area: actions;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4) 0 0;
	}
	.tallying {
		margin: 0;
		color: var(--fg-muted);
		font-weight: 600;
	}
	.filter {
		display: grid;
		gap: var(--space-2);
		margin: var(--space-3) 0 0;
		padding: 0;
		border: 0;
		legend {
			margin-bottom: var(--space-2);
			font-size: 13px;
			font-weight: 700;
			color: var(--fg-muted);
		}
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		label {
			position: relative;
			color: var(--dir, var(--fg));
		}
		input {
			position: absolute;
			opacity: 0;
		}
		label > span {
			display: grid;
			place-items: center;
			min-width: 36px;
			height: 36px;
			padding: 0 8px;
			border: 1px solid var(--border);
			border-radius: var(--radius);
			font-weight: 700;
		}
		input:checked + span {
			border-color: currentColor;
			background: color-mix(in srgb, currentColor 15%, transparent);
		}
		input:focus-visible + span {
			outline: 2px solid var(--accent);
		}
	}

	.empty {
		display: grid;
		place-content: center;
		gap: var(--space-3);
		min-height: 100dvh;
		padding: var(--space-4);
		text-align: center;
		div {
			display: flex;
			gap: var(--space-2);
			justify-content: center;
		}
	}

	@media (max-width: 899px) {
		.screen {
			grid-template-areas: 'status' 'scores' 'board' 'actions';
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto auto minmax(0, 1fr) auto;
			gap: var(--space-2);
			padding-bottom: 0;
		}
		.status {
			gap: var(--space-2);
		}
		.who {
			min-width: 0;
			font-size: 16px;
			.mark {
				font-size: 22px;
			}
		}
		.counts {
			gap: var(--space-2);
			justify-content: flex-start;
			dt {
				font-size: 11px;
			}
			.round {
				display: none;
			}
		}
		.menu .label {
			display: none;
		}
		.counts .long {
			display: none;
		}
		.counts .short {
			display: inline;
		}
		.counts > div {
			flex-direction: column-reverse;
			gap: 0;
		}
		.counts dd {
			height: 1.9em;
			line-height: 1.9em;
			font-size: 15px;
		}
		.scores {
			padding: var(--space-1) var(--space-2) 0;
			overflow: visible;
		}
		.actions {
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			padding: var(--space-2) var(--space-2) max(var(--space-2), env(safe-area-inset-bottom));
			background: var(--surface);
			border-top: 1px solid var(--border);
			> .btn {
				flex: 1;
			}
		}
		.filter {
			grid-template-columns: auto auto;
			align-items: center;
			margin: 0;
			legend {
				display: none;
			}
		}
	}
</style>
