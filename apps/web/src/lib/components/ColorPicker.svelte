<script lang="ts">
	import { PLAYER_COLORS } from '../palette.ts';

	/** Choose a player colour; colours other players hold are disabled. */
	let { value = $bindable(), taken = [] }: { value: number; taken?: number[] } = $props();
</script>

<div class="colors" role="radiogroup" aria-label="Colour">
	{#each PLAYER_COLORS as color, i (i)}
		<button
			type="button"
			role="radio"
			class="swatch"
			aria-checked={value === i}
			aria-label={color.name}
			title={color.name}
			disabled={taken.includes(i) && value !== i}
			style:--c={color.hex}
			onclick={() => (value = i)}
		></button>
	{/each}
</div>

<style>
	.colors {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.swatch {
		width: 32px;
		height: 32px;
		border: 3px solid var(--surface);
		border-radius: 50%;
		background: var(--c);
		box-shadow: 0 0 0 1px var(--border);
		cursor: pointer;
		&[aria-checked='true'] {
			box-shadow: 0 0 0 2px var(--fg);
		}
		&:disabled {
			opacity: 0.2;
			cursor: not-allowed;
		}
	}
</style>
