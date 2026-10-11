<script lang="ts">
	import { resolve } from '$app/paths';
	import { exportRecord } from '../files.ts';
	import type { Game } from '../game.svelte.ts';
	import { prefs, type Scheme } from '../prefs.svelte.ts';
	import Dialog from './Dialog.svelte';

	/** Game actions and per-device display preferences (GDD section 7). */
	let { game, open = $bindable(false) }: { game: Game; open?: boolean } = $props();

	let confirmRestart = $state(false);

	const schemes: { value: Scheme; label: string }[] = [
		{ value: 'system', label: 'System' },
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' }
	];
</script>

<Dialog bind:open title="Menu" onclose={() => (confirmRestart = false)}>
	<section>
		<h3>Game</h3>
		<div class="actions">
			<button class="btn" onclick={() => exportRecord(game.state.record)}>Save game to file</button>
			<a class="btn" href={resolve('/setup')}>New game…</a>
			<a class="btn" href={resolve('/learn')}>How to play</a>
			<a class="btn" href={resolve('/')}>Home</a>
		</div>
		{#if confirmRestart}
			<div class="confirm" role="alert">
				<p>Clear the board and start again with the same players and settings?</p>
				<button
					class="btn danger"
					onclick={() => {
						game.restart();
						open = false;
					}}>Restart game</button
				>
				<button class="btn" onclick={() => (confirmRestart = false)}>Keep playing</button>
			</div>
		{:else}
			<button class="btn danger" onclick={() => (confirmRestart = true)}>Restart game…</button>
		{/if}
	</section>

	<section>
		<h3>Display</h3>
		<fieldset class="row">
			<legend>Theme</legend>
			<div class="segmented">
				{#each schemes as s (s.value)}
					<label>
						<input
							type="radio"
							name="scheme"
							value={s.value}
							checked={prefs.scheme === s.value}
							onchange={() => {
								prefs.scheme = s.value;
								prefs.save();
							}}
						/>
						<span>{s.label}</span>
					</label>
				{/each}
			</div>
		</fieldset>
		<label class="row">
			<span>Board size</span>
			<input
				type="range"
				min="50"
				max="100"
				step="5"
				bind:value={prefs.boardSize}
				onchange={() => prefs.save()}
				aria-valuetext={`${prefs.boardSize}%`}
			/>
			<span class="num">{prefs.boardSize}%</span>
		</label>
		<label class="row check">
			<input type="checkbox" bind:checked={prefs.sound} onchange={() => prefs.save()} />
			<span>Sound</span>
		</label>
		<label class="row check">
			<input type="checkbox" bind:checked={prefs.haptics} onchange={() => prefs.save()} />
			<span>Vibration on supported phones</span>
		</label>
		<label class="row check">
			<input
				type="checkbox"
				checked={prefs.motion === 'reduce'}
				onchange={(e) => {
					prefs.motion = e.currentTarget.checked ? 'reduce' : 'system';
					prefs.save();
				}}
			/>
			<span>Reduce motion</span>
		</label>
	</section>
	{#snippet footer()}
		<button class="btn" onclick={() => (open = false)}>Back to game</button>
	{/snippet}
</Dialog>

<style>
	section + section {
		margin-top: var(--space-5);
	}
	h3 {
		margin-bottom: var(--space-3);
		font-size: 13px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--fg-muted);
	}
	.actions {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}
	.confirm {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		border: 1px solid var(--danger);
		border-radius: var(--radius);
		p {
			flex-basis: 100%;
			margin: 0;
		}
	}
	fieldset {
		margin: 0;
		padding: 0;
		border: 0;
	}
	legend {
		float: left;
		min-width: 110px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: var(--control-h);
		> span:first-child {
			min-width: 110px;
		}
	}
	.check > span:first-child {
		min-width: 0;
	}
	.check input {
		width: 18px;
		height: 18px;
		accent-color: var(--accent);
	}
	input[type='range'] {
		flex: 1;
		accent-color: var(--accent);
	}
	.segmented {
		display: inline-flex;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
		label {
			position: relative;
		}
		input {
			position: absolute;
			opacity: 0;
		}
		span {
			display: inline-block;
			padding: 8px 14px;
			font-weight: 600;
		}
		input:checked + span {
			background: var(--accent-soft);
			color: var(--accent);
		}
		input:focus-visible + span {
			outline: 2px solid var(--accent);
			outline-offset: -2px;
		}
	}
</style>
