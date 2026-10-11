<script lang="ts">
	import type { Game } from '../game.svelte.ts';
	import ColorPicker from './ColorPicker.svelte';
	import Dialog from './Dialog.svelte';
	import MarkPicker from './MarkPicker.svelte';

	/** Edit a player's name, mark and colour. Cosmetic, so allowed at any time. */
	let { game, seat = $bindable() }: { game: Game; seat: number | undefined } = $props();

	let open = $state(false);
	let name = $state('');
	let mark = $state('');
	let color = $state(0);

	$effect(() => {
		if (seat === undefined) return;
		const s = game.seats[seat]!;
		name = s.name;
		mark = s.mark;
		color = s.color;
		open = true;
	});

	const others = $derived(game.seats.filter((_, i) => i !== seat));

	function save() {
		if (seat === undefined) return;
		game.editSeat(seat, { name: name.trim() || game.seats[seat]!.name, mark, color });
		open = false;
	}
</script>

<Dialog bind:open title="Edit player" onclose={() => (seat = undefined)}>
	<form
		id="player-form"
		onsubmit={(e) => {
			e.preventDefault();
			save();
		}}
	>
		<label class="field">
			<span>Name</span>
			<input type="text" bind:value={name} maxlength="20" required />
		</label>
		<fieldset>
			<legend>Colour</legend>
			<ColorPicker bind:value={color} taken={others.map((s) => s.color)} />
		</fieldset>
		<fieldset>
			<legend>Mark</legend>
			<MarkPicker bind:value={mark} taken={others.map((s) => s.mark)} />
		</fieldset>
	</form>
	{#snippet footer()}
		<button class="btn" type="button" onclick={() => (open = false)}>Cancel</button>
		<button class="btn primary" type="submit" form="player-form">Save player</button>
	{/snippet}
</Dialog>

<style>
	.field {
		display: grid;
		gap: var(--space-1);
		margin-bottom: var(--space-4);
	}
	fieldset {
		margin: 0 0 var(--space-4);
		padding: 0;
		border: 0;
	}
	legend {
		margin-bottom: var(--space-2);
		font-weight: 700;
	}
</style>
