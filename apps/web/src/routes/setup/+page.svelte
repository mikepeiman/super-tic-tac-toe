<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import {
		adaptPreset,
		boardShapes,
		cellsToScoreWarning,
		createGame,
		DEFAULT_MARKS,
		LIMITS,
		nudgeSide,
		paceOptions,
		PRESETS,
		validateConfig,
		validateSeats,
		type BotLevel,
		type GameConfig,
		type Seat
	} from '@sttt/engine';
	import ColorPicker from '#lib/components/ColorPicker.svelte';
	import Dialog from '#lib/components/Dialog.svelte';
	import MarkPicker from '#lib/components/MarkPicker.svelte';
	import { PALETTE_SIZE, playerVars } from '#lib/palette.ts';
	import { loadCurrent, loadSetup, saveCurrent, saveSetup } from '#lib/storage.ts';

	type Kind = 'human' | BotLevel;
	interface Draft {
		name: string;
		mark: string;
		color: number;
		kind: Kind;
	}
	interface Saved {
		players: Draft[];
		presetId: string;
		method: 'board' | 'pace';
		config: GameConfig;
	}

	const solo = page.url.searchParams.get('mode') === 'solo';

	let players = $state<Draft[]>([]);
	let presetId = $state('classic');
	let method = $state<'board' | 'pace'>('board');
	let config = $state<GameConfig>({ ...PRESETS[2]!.config, autoEndTurn: true, liveScore: false });
	/** Rounds, edited directly in pace-first setup. */
	let rounds = $state(12);
	let editing = $state<number | undefined>();
	let appearanceOpen = $state(false);
	let inProgress = $state(false);

	const draft = (i: number, kind: Kind = 'human'): Draft => ({
		name: kind === 'human' ? `Player ${i + 1}` : `Bot ${i + 1}`,
		mark: DEFAULT_MARKS[i % DEFAULT_MARKS.length]!,
		color: i % PALETTE_SIZE,
		kind
	});

	onMount(() => {
		const saved = loadSetup<Saved>();
		if (saved?.players?.length && saved.config) {
			players = saved.players.slice(0, LIMITS.maxPlayers);
			presetId = saved.presetId ?? 'classic';
			method = saved.method === 'pace' ? 'pace' : 'board';
			config = { ...config, ...saved.config };
		} else {
			players = [draft(0), draft(1)];
		}
		if (solo && !players.some((p) => p.kind !== 'human')) {
			players = [
				{ ...players[0]!, kind: 'human' },
				{ ...draft(1, 'greedy'), mark: players[1]?.mark ?? '🦄', color: players[1]?.color ?? 1 }
			];
		}
		rounds = currentRounds();
		const current = loadCurrent();
		inProgress = !!current && !current.finished;
	});

	const preset = $derived(PRESETS.find((p) => p.id === presetId));

	// Presets follow the player count (GDD section 4).
	$effect(() => {
		const count = players.length;
		if (!preset) return;
		const adapted = adaptPreset(preset, count);
		untrack(() => {
			config = { ...config, ...adapted };
			rounds = currentRounds();
		});
	});

	function currentRounds() {
		return (config.rows * config.cols) / (Math.max(1, players.length) * config.movesPerTurn);
	}

	const paceChoices = $derived(paceOptions(config.rows, config.cols, players.length));
	const shapeChoices = $derived(boardShapes(players.length, config.movesPerTurn, rounds));

	const seats = $derived<Seat[]>(
		players.map((p) => ({
			name: p.name.trim(),
			mark: p.mark,
			color: p.color,
			kind: p.kind === 'human' ? 'human' : 'bot',
			...(p.kind !== 'human' ? { bot: p.kind } : {})
		}))
	);
	const configCheck = $derived(validateConfig(config, players.length));
	const seatCheck = $derived(validateSeats(seats, PALETTE_SIZE));
	const error = $derived(
		!seatCheck.ok ? seatCheck.error : !configCheck.ok ? configCheck.error : ''
	);
	const warning = $derived(configCheck.ok ? cellsToScoreWarning(config) : undefined);
	const roundsNow = $derived(Number.isInteger(currentRounds()) ? currentRounds() : undefined);

	function addPlayer() {
		if (players.length >= LIMITS.maxPlayers) return;
		const usedMarks = new Set(players.map((p) => p.mark));
		const usedColors = new Set(players.map((p) => p.color));
		const i = players.length;
		const mark = DEFAULT_MARKS.find((m) => !usedMarks.has(m)) ?? '⭐';
		const color = [...Array(PALETTE_SIZE).keys()].find((c) => !usedColors.has(c)) ?? 0;
		players = [...players, { ...draft(i, solo ? 'greedy' : 'human'), mark, color }];
		afterPlayersChange();
	}

	function removePlayer(i: number) {
		if (players.length <= LIMITS.minPlayers) return;
		players = players.filter((_, j) => j !== i);
		afterPlayersChange();
	}

	/** Keep a custom board fair when the player count changes. */
	function afterPlayersChange() {
		if (preset) return;
		if (method === 'board') {
			config.rows = nudgeSide(config.rows, config.cols, players.length, 1);
			pickPace();
		} else {
			pickShape();
		}
	}

	function pickPace() {
		const options = paceOptions(config.rows, config.cols, players.length);
		if (!options.length) return;
		const keep = options.find((o) => o.movesPerTurn === config.movesPerTurn);
		const pick =
			keep ??
			options.reduce((a, b) =>
				Math.abs(b.movesPerTurn - config.movesPerTurn) <
				Math.abs(a.movesPerTurn - config.movesPerTurn)
					? b
					: a
			);
		config.movesPerTurn = pick.movesPerTurn;
		rounds = pick.rounds;
	}

	function pickShape() {
		const shapes = boardShapes(players.length, config.movesPerTurn, rounds);
		const keep = shapes.find((s) => s.rows === config.rows && s.cols === config.cols);
		const pick = keep ?? shapes[Math.floor(shapes.length / 2)];
		if (pick) {
			config.rows = pick.rows;
			config.cols = pick.cols;
		}
	}

	/** Board first: step the side to the nearest fair value in the direction of change. */
	function changeSide(side: 'rows' | 'cols', value: number) {
		if (!Number.isFinite(value)) return;
		const old = config[side];
		const clamped = Math.max(LIMITS.minSide, Math.min(LIMITS.maxSide, Math.round(value)));
		const other = side === 'rows' ? config.cols : config.rows;
		config[side] = nudgeSide(clamped, other, players.length, clamped >= old ? 1 : -1);
		pickPace();
	}

	function changePace(field: 'movesPerTurn' | 'rounds', value: number) {
		if (!Number.isFinite(value) || value < 1) return;
		if (field === 'movesPerTurn') config.movesPerTurn = Math.round(value);
		else rounds = Math.round(value);
		pickShape();
	}

	function chooseCustom() {
		presetId = 'custom';
		rounds = currentRounds();
	}

	function start() {
		if (error) return;
		const created = createGame({ ...config }, seats);
		if (!created.ok) return;
		saveSetup({ players, presetId, method, config } satisfies Saved);
		saveCurrent(created.value.record);
		void goto(resolve('/play'));
	}

	const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
</script>

<svelte:head>
	<title>New game · Super Tic-Tac-Toe</title>
</svelte:head>

<main class="page">
	<header class="top">
		<a class="btn ghost" href={resolve('/')}>← Home</a>
		<h1>{solo ? 'Play the computer' : 'New game'}</h1>
	</header>

	<section aria-labelledby="players-h">
		<div class="section-head">
			<h2 id="players-h">Players</h2>
			<div class="count" role="group" aria-label="Number of players">
				<button
					class="btn icon"
					aria-label="Remove a player"
					disabled={players.length <= LIMITS.minPlayers}
					onclick={() => removePlayer(players.length - 1)}>−</button
				>
				<span class="num" aria-live="polite">{players.length}</span>
				<button
					class="btn icon"
					aria-label="Add a player"
					disabled={players.length >= LIMITS.maxPlayers}
					onclick={addPlayer}>+</button
				>
			</div>
		</div>
		<ol class="players">
			{#each players as p, i (i)}
				<li style={playerVars(p.color)}>
					<button
						class="look"
						aria-label={`Change mark and colour for ${p.name || `player ${i + 1}`}`}
						onclick={() => {
							editing = i;
							appearanceOpen = true;
						}}><span aria-hidden="true">{p.mark}</span></button
					>
					<input
						type="text"
						bind:value={p.name}
						maxlength="20"
						aria-label={`Player ${i + 1} name`}
					/>
					<select bind:value={p.kind} aria-label={`Player ${i + 1} is`}>
						<option value="human">Person</option>
						<option value="greedy">Computer</option>
						<option value="scatter">Computer (easy)</option>
					</select>
					<button
						class="btn ghost icon"
						aria-label={`Remove ${p.name || `player ${i + 1}`}`}
						disabled={players.length <= LIMITS.minPlayers}
						onclick={() => removePlayer(i)}
					>
						<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
							><path
								d="M6 6l12 12M18 6L6 18"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
							/></svg
						>
					</button>
				</li>
			{/each}
		</ol>
	</section>

	<section aria-labelledby="game-h">
		<h2 id="game-h">Game</h2>
		<div class="presets" role="radiogroup" aria-label="Game type">
			{#each PRESETS as pr (pr.id)}
				{@const c = adaptPreset(pr, players.length)}
				<button
					type="button"
					role="radio"
					aria-checked={presetId === pr.id}
					class="preset"
					onclick={() => (presetId = pr.id)}
				>
					<span
						class="thumb"
						style:aspect-ratio="{c.cols} / {c.rows}"
						style:--cols={c.cols}
						style:--rows={c.rows}
						aria-hidden="true"
					></span>
					<strong>{pr.name}</strong>
					<span class="meta num"
						>{c.rows}×{c.cols} · {c.movesPerTurn} per turn · {c.cellsToScore} to score</span
					>
					<span class="blurb">{pr.blurb}</span>
				</button>
			{/each}
			<button
				type="button"
				role="radio"
				aria-checked={presetId === 'custom'}
				class="preset custom"
				onclick={chooseCustom}
			>
				<strong>Custom</strong>
				<span class="blurb">Choose the board, pace and scoring yourself.</span>
			</button>
		</div>

		<div class="sentence" class:readonly={presetId !== 'custom'}>
			{#if presetId === 'custom'}
				<div class="method" role="radiogroup" aria-label="Set up by">
					<button
						type="button"
						role="radio"
						aria-checked={method === 'board'}
						onclick={() => (method = 'board')}>Board first</button
					>
					<button
						type="button"
						role="radio"
						aria-checked={method === 'pace'}
						onclick={() => {
							method = 'pace';
							rounds = currentRounds();
						}}>Pace first</button
					>
				</div>
			{/if}
			<p>
				This game shall have <strong class="num">{players.length}</strong> players.
				{#if presetId === 'custom' && method === 'board'}
					The board shall be
					<input
						type="number"
						aria-label="Rows"
						min={LIMITS.minSide}
						max={LIMITS.maxSide}
						value={config.rows}
						onchange={(e) => changeSide('rows', e.currentTarget.valueAsNumber)}
					/>
					rows tall by
					<input
						type="number"
						aria-label="Columns"
						min={LIMITS.minSide}
						max={LIMITS.maxSide}
						value={config.cols}
						onchange={(e) => changeSide('cols', e.currentTarget.valueAsNumber)}
					/>
					columns wide.
				{:else if presetId === 'custom'}
					Each turn shall have
					<input
						type="number"
						aria-label="Moves per turn"
						min="1"
						max="450"
						value={config.movesPerTurn}
						onchange={(e) => changePace('movesPerTurn', e.currentTarget.valueAsNumber)}
					/>
					moves, for
					<input
						type="number"
						aria-label="Rounds"
						min="1"
						max="450"
						value={rounds}
						onchange={(e) => changePace('rounds', e.currentTarget.valueAsNumber)}
					/>
					rounds.
				{:else}
					The board is <strong class="num">{config.rows}</strong> rows by
					<strong class="num">{config.cols}</strong>
					columns, with
					<strong class="num">{config.movesPerTurn}</strong> moves per turn{#if roundsNow}, for
						<strong class="num">{roundsNow}</strong> rounds{/if}.
				{/if}
				That is <strong class="num">{config.rows * config.cols}</strong> squares{#if roundsNow}, or <strong
						class="num">{(config.rows * config.cols) / players.length}</strong
					> moves per player{/if}. It will take
				{#if presetId === 'custom'}
					<input
						type="number"
						aria-label="Cells in a row to score"
						min="2"
						max={Math.max(config.rows, config.cols)}
						value={config.cellsToScore}
						onchange={(e) =>
							(config.cellsToScore = clamp(
								e.currentTarget.valueAsNumber || 3,
								2,
								Math.max(config.rows, config.cols)
							))}
					/>
				{:else}
					<strong class="num">{config.cellsToScore}</strong>
				{/if}
				in a row to score, and a complete line earns a bonus of
				{#if presetId === 'custom'}
					<input
						type="number"
						aria-label="Line bonus"
						min="0"
						max={LIMITS.maxBonus}
						value={config.lineBonus}
						onchange={(e) =>
							(config.lineBonus = clamp(e.currentTarget.valueAsNumber || 0, 0, LIMITS.maxBonus))}
					/>.
				{:else}
					<strong class="num">{config.lineBonus}</strong>.
				{/if}
			</p>

			{#if presetId === 'custom' && method === 'board'}
				<fieldset>
					<legend>Choose moves per turn and rounds</legend>
					<div class="choices" role="radiogroup" aria-label="Moves per turn and rounds">
						{#each paceChoices as o (o.movesPerTurn)}
							<button
								type="button"
								role="radio"
								aria-checked={config.movesPerTurn === o.movesPerTurn}
								class="choice num"
								onclick={() => {
									config.movesPerTurn = o.movesPerTurn;
									rounds = o.rounds;
								}}
							>
								<span>{o.movesPerTurn}</span><small>{o.rounds} rounds</small>
							</button>
						{:else}
							<p class="note">No fair split for this board. Change rows or columns.</p>
						{/each}
					</div>
				</fieldset>
			{:else if presetId === 'custom'}
				<fieldset>
					<legend>Choose a board shape</legend>
					<div class="choices shapes" role="radiogroup" aria-label="Board shape">
						{#each shapeChoices as s (`${s.rows}x${s.cols}`)}
							<button
								type="button"
								role="radio"
								aria-checked={config.rows === s.rows && config.cols === s.cols}
								class="choice"
								onclick={() => {
									config.rows = s.rows;
									config.cols = s.cols;
								}}
							>
								<span
									class="thumb"
									style:aspect-ratio="{s.cols} / {s.rows}"
									style:--cols={s.cols}
									style:--rows={s.rows}
									aria-hidden="true"
								></span>
								<small class="num">{s.rows}×{s.cols}</small>
							</button>
						{:else}
							<p class="note">
								No board between 3 and 30 squares a side fits this pace. Try other numbers.
							</p>
						{/each}
					</div>
				</fieldset>
			{/if}
		</div>
	</section>

	<section aria-labelledby="options-h">
		<h2 id="options-h">Options</h2>
		<label class="option">
			<input type="checkbox" bind:checked={config.autoEndTurn} />
			<span
				><strong>End the turn on the last move</strong><br /><small
					>Off: confirm with End turn, so the last move can still be taken back.</small
				></span
			>
		</label>
		<label class="option">
			<input type="checkbox" bind:checked={config.liveScore} />
			<span
				><strong>Live score</strong><br /><small
					>Off: scores stay hidden until you tally them or the board is full.</small
				></span
			>
		</label>
	</section>

	<footer class="go">
		<p class="msg" role="status">
			{#if error}<span class="error">{error}</span>{:else if warning}<span class="warn"
					>{warning}</span
				>{:else if inProgress}This replaces the game in progress.{/if}
		</p>
		<button class="btn primary big" disabled={!!error} onclick={start}>Start game</button>
	</footer>
</main>

{#if editing !== undefined && players[editing]}
	{@const others = players.filter((_, j) => j !== editing)}
	<Dialog bind:open={appearanceOpen} title="Mark and colour" onclose={() => (editing = undefined)}>
		<h3 class="sub">Colour</h3>
		<ColorPicker
			bind:value={() => players[editing!]?.color ?? 0, (v) => (players[editing!]!.color = v)}
			taken={others.map((o) => o.color)}
		/>
		<h3 class="sub">Mark</h3>
		<MarkPicker
			bind:value={() => players[editing!]?.mark ?? '', (v) => (players[editing!]!.mark = v)}
			taken={others.map((o) => o.mark)}
		/>
		{#snippet footer()}
			<button class="btn primary" onclick={() => (appearanceOpen = false)}>Done</button>
		{/snippet}
	</Dialog>
{/if}

<style>
	.page {
		max-width: 880px;
		margin: 0 auto;
		padding: var(--space-4) var(--space-4) 120px;
	}
	.top {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
		h1 {
			font-size: 26px;
		}
	}
	section {
		margin-bottom: var(--space-5);
	}
	h2 {
		margin-bottom: var(--space-3);
		font-size: 18px;
	}
	.section-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		h2 {
			margin: 0;
		}
	}
	.count {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: 18px;
		font-weight: 800;
		.btn {
			font-size: 20px;
		}
	}
	.players {
		display: grid;
		gap: var(--space-2);
		margin: var(--space-3) 0 0;
		padding: 0;
		list-style: none;
		li {
			display: grid;
			grid-template-columns: auto 1fr auto auto;
			gap: var(--space-2);
			align-items: center;
			padding: var(--space-1);
			border-left: 6px solid var(--player);
			border-radius: var(--radius);
			background: var(--surface);
		}
		input {
			min-width: 0;
		}
	}
	.look {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: var(--radius);
		background: var(--player);
		font-family: var(--emoji);
		font-size: 24px;
		cursor: pointer;
		&:hover {
			outline: 2px solid var(--accent);
		}
	}

	.presets {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
		gap: var(--space-2);
	}
	.preset {
		display: grid;
		align-content: start;
		gap: 4px;
		padding: var(--space-3);
		border: 2px solid var(--border);
		border-radius: var(--radius-lg);
		background: var(--surface);
		color: var(--fg);
		font: inherit;
		text-align: left;
		cursor: pointer;
		&:hover {
			border-color: var(--accent);
		}
		&[aria-checked='true'] {
			border-color: var(--accent);
			background: var(--accent-soft);
		}
		.meta {
			font-size: 12px;
			color: var(--fg-muted);
		}
		.blurb {
			font-size: 13px;
		}
	}
	.thumb {
		display: block;
		max-height: 44px;
		max-width: 100%;
		height: 44px;
		border: 2px solid var(--fg-muted);
		border-radius: 2px;
		background:
			repeating-linear-gradient(
				90deg,
				transparent 0 calc(100% / var(--cols) - 1px),
				var(--border) 0 calc(100% / var(--cols))
			),
			repeating-linear-gradient(
				0deg,
				transparent 0 calc(100% / var(--rows) - 1px),
				var(--border) 0 calc(100% / var(--rows))
			),
			linear-gradient(135deg, #3b6fd433, #8466d433);
	}

	.sentence {
		margin-top: var(--space-4);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		background: var(--surface);
		p {
			margin: 0;
			font-size: 18px;
			line-height: 2.1;
		}
		strong {
			color: var(--accent);
		}
		input[type='number'] {
			min-height: 34px;
			border: 0;
			border-bottom: 2px solid var(--accent);
			border-radius: 0;
			background: transparent;
			color: var(--accent);
			font-size: 18px;
			font-weight: 800;
		}
		fieldset {
			margin: var(--space-4) 0 0;
			padding: 0;
			border: 0;
		}
		legend {
			margin-bottom: var(--space-2);
			font-weight: 700;
			color: var(--fg-muted);
		}
	}
	.method {
		display: inline-flex;
		margin-bottom: var(--space-3);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
		button {
			padding: 8px 14px;
			border: 0;
			background: transparent;
			color: var(--fg);
			font: inherit;
			font-weight: 700;
			cursor: pointer;
			&[aria-checked='true'] {
				background: var(--accent-soft);
				color: var(--accent);
			}
		}
	}
	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
	.choice {
		display: grid;
		justify-items: center;
		gap: 2px;
		min-width: 56px;
		padding: 6px 10px;
		border: 2px dashed var(--accent);
		border-radius: var(--radius);
		background: transparent;
		color: var(--fg);
		font: inherit;
		cursor: pointer;
		span {
			font-size: 18px;
			font-weight: 800;
		}
		small {
			color: var(--fg-muted);
		}
		&[aria-checked='true'] {
			border-style: solid;
			background: var(--accent-soft);
		}
	}
	.shapes .thumb {
		height: 40px;
	}
	.note {
		margin: 0;
		color: var(--fg-muted);
		font-size: 14px !important;
		line-height: 1.4 !important;
	}

	.option {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-2) 0;
		input {
			width: 20px;
			height: 20px;
			margin-top: 2px;
			accent-color: var(--accent);
		}
		small {
			color: var(--fg-muted);
		}
	}

	.go {
		position: fixed;
		inset: auto 0 0 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--space-4);
		padding: var(--space-3) max(var(--space-4), calc((100vw - 880px) / 2 + var(--space-4)));
		padding-bottom: max(var(--space-3), env(safe-area-inset-bottom));
		border-top: 1px solid var(--border);
		background: var(--surface);
	}
	.msg {
		margin: 0;
		color: var(--fg-muted);
		font-size: 14px;
	}
	.error {
		color: var(--danger);
	}
	.warn {
		color: var(--bonus);
	}
	.big {
		min-height: 48px;
		padding: 0 var(--space-5);
		font-size: 17px;
	}
	.sub {
		margin: var(--space-3) 0 var(--space-2);
		font-size: 14px;
	}
</style>
