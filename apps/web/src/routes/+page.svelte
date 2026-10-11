<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { derive, rank, scoreBoard, type GameRecord, type GameState } from '@sttt/engine';
	import Dialog from '#lib/components/Dialog.svelte';
	import { exportRecord, importRecord } from '#lib/files.ts';
	import { colorOf } from '#lib/palette.ts';
	import { listHistory, loadCurrent, saveCurrent } from '#lib/storage.ts';

	let current = $state<GameState>();
	let history = $state<GameRecord[]>([]);
	let importError = $state('');
	let pendingOpen = $state<GameState>();
	let confirmOpen = $state(false);
	let fileInput = $state<HTMLInputElement>();

	onMount(async () => {
		current = loadCurrent();
		history = await listHistory();
	});

	const inProgress = $derived(current && !current.finished ? current : undefined);

	function open(state: GameState) {
		if (inProgress && inProgress.record.id !== state.record.id) {
			pendingOpen = state;
			confirmOpen = true;
			return;
		}
		saveCurrent(state.record);
		void goto(resolve('/play'));
	}

	async function onFile(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		importError = '';
		if (!file) return;
		const result = await importRecord(file);
		if (fileInput) fileInput.value = '';
		if (!result.ok) importError = result.error;
		else open(result.value);
	}

	function summary(record: GameRecord) {
		const state = derive(record);
		const scores = scoreBoard(state.owners, record.config, record.seats.length);
		const places = new Map(rank(scores).map((r) => [r.seat, r.place]));
		return record.seats.map((s, i) => ({
			seat: s,
			score: scores[i]!.total,
			won: places.get(i) === 1
		}));
	}

	const when = (iso?: string) =>
		iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';

	const DEMO = ['🔥', '🔥', '🦄', '🔥', '🦄', '🦄', '🦄', '🔥', '🔥'];
</script>

<svelte:head>
	<title>Super Tic-Tac-Toe</title>
</svelte:head>

<main class="home">
	<header class="hero">
		<div class="logo" aria-hidden="true">
			{#each DEMO as m, i (i)}<span style:--c={colorOf(m === '🔥' ? 0 : 1)}>{m}</span>{/each}
		</div>
		<div>
			<h1>Super Tic-Tac-Toe</h1>
			<p>
				Big boards, several moves a turn, and every run of three scores. Fill the board; the best
				territory wins.
			</p>
		</div>
	</header>

	<nav class="start" aria-label="Start">
		{#if inProgress}
			<a class="tile primary" href={resolve('/play')}>
				<strong>Continue game</strong>
				<span>
					{inProgress.record.seats.map((s) => `${s.mark} ${s.name}`).join(' · ')} — move {inProgress.movesPlayed}
					of {inProgress.totalCells}
				</span>
			</a>
		{/if}
		<a class="tile" class:primary={!inProgress} href={resolve('/setup')}>
			<strong>Play here</strong>
			<span>Pass and play on this device, 2–8 players.</span>
		</a>
		<a class="tile" href={resolve('/setup?mode=solo')}>
			<strong>Play the computer</strong>
			<span>Take on a computer player, or fill seats with several.</span>
		</a>
		<a class="tile" href={resolve('/learn')}>
			<strong>How to play</strong>
			<span>The rules and scoring in two minutes.</span>
		</a>
	</nav>

	<section aria-labelledby="games-h">
		<div class="section-head">
			<h2 id="games-h">Your games</h2>
			<label class="btn small">
				Load from file…
				<input
					bind:this={fileInput}
					class="visually-hidden"
					type="file"
					accept=".json,application/json"
					onchange={onFile}
				/>
			</label>
		</div>
		{#if importError}<p class="error" role="alert">{importError}</p>{/if}
		{#if history.length === 0}
			<p class="empty">Finished games appear here. They are kept on this device only.</p>
		{:else}
			<ul class="games">
				{#each history as record (record.id)}
					<li>
						<span class="date">{when(record.finishedAt)}</span>
						<span class="who">
							{#each summary(record) as p, i (i)}
								<span class="p" class:won={p.won}>
									<span class="m" style:--c={colorOf(p.seat.color)}>{p.seat.mark}</span>
									{p.seat.name} <b class="num">{p.score}</b>
								</span>
							{/each}
						</span>
						<span class="acts">
							<button class="btn small" onclick={() => open(derive(record))}>View</button>
							<button class="btn small ghost" onclick={() => exportRecord(record)}
								>Save to file</button
							>
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</main>

<Dialog
	bind:open={confirmOpen}
	title="Replace the game in progress?"
	onclose={() => (pendingOpen = undefined)}
>
	<p>
		Opening this game ends the one in progress. Save that one to a file first if you want to come
		back to it.
	</p>
	{#snippet footer()}
		{#if inProgress}
			<button class="btn" onclick={() => inProgress && exportRecord(inProgress.record)}
				>Save current to file</button
			>
		{/if}
		<button class="btn" onclick={() => (confirmOpen = false)}>Cancel</button>
		<button
			class="btn danger"
			onclick={() => {
				if (!pendingOpen) return;
				saveCurrent(pendingOpen.record);
				confirmOpen = false;
				void goto(resolve('/play'));
			}}>Replace and open</button
		>
	{/snippet}
</Dialog>

<style>
	.home {
		max-width: 880px;
		margin: 0 auto;
		padding: var(--space-5) var(--space-4) var(--space-5);
	}
	.hero {
		display: flex;
		align-items: center;
		gap: var(--space-5);
		margin-bottom: var(--space-5);
		h1 {
			font-size: clamp(28px, 5vw, 40px);
			font-weight: 900;
		}
		p {
			max-width: 46ch;
			margin: var(--space-2) 0 0;
			color: var(--fg-muted);
			font-size: 16px;
		}
	}
	.logo {
		display: grid;
		grid-template-columns: repeat(3, 34px);
		gap: 2px;
		flex: none;
		padding: 4px;
		border: 4px solid var(--c, #c94a44);
		background: var(--cell-gap);
		span {
			display: grid;
			place-items: center;
			height: 34px;
			background: var(--c);
			font-family: var(--emoji);
			font-size: 20px;
		}
	}

	.start {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-3);
		margin-bottom: var(--space-5);
	}
	.tile {
		display: grid;
		gap: 4px;
		padding: var(--space-4);
		border: 2px solid var(--border);
		border-radius: var(--radius-lg);
		background: var(--surface);
		color: var(--fg);
		text-decoration: none;
		strong {
			font-size: 18px;
		}
		span {
			color: var(--fg-muted);
			font-size: 14px;
		}
		&:hover {
			border-color: var(--accent);
		}
		&.primary {
			border-color: var(--primary);
			strong {
				color: var(--primary);
			}
		}
	}

	.section-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-3);
		h2 {
			font-size: 18px;
		}
	}
	.empty {
		color: var(--fg-muted);
	}
	.error {
		color: var(--danger);
	}
	.games {
		display: grid;
		gap: 1px;
		margin: 0;
		padding: 0;
		list-style: none;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
		background: var(--border);
		li {
			display: grid;
			grid-template-columns: 150px 1fr auto;
			gap: var(--space-3);
			align-items: center;
			padding: var(--space-2) var(--space-3);
			background: var(--surface);
		}
	}
	.date {
		color: var(--fg-muted);
		font-size: 13px;
	}
	.who {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}
	.p {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		&.won b {
			color: var(--bonus);
		}
	}
	.m {
		display: inline-grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border-radius: 4px;
		background: var(--c);
		font-family: var(--emoji);
		font-size: 14px;
	}
	.acts {
		display: flex;
		gap: var(--space-1);
	}

	@media (max-width: 640px) {
		.hero {
			flex-direction: column;
			align-items: flex-start;
		}
		.games li {
			grid-template-columns: 1fr;
		}
	}
</style>
