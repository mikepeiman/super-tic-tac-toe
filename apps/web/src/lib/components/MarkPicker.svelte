<script lang="ts">
	import { DEFAULT_MARKS } from '@sttt/engine';

	/**
	 * Choose a mark: the default set and a curated shortlist first, plus a field to paste any
	 * emoji (for example from the system picker, Win + . or Ctrl + Cmd + Space). Marks other
	 * players hold are shown but disabled.
	 */
	let { value = $bindable(), taken = [] }: { value: string; taken?: string[] } = $props();

	const SHORTLIST = [
		...DEFAULT_MARKS,
		'🐙',
		'🦊',
		'🐸',
		'🐼',
		'🦁',
		'🐝',
		'🦋',
		'🐢',
		'🦖',
		'🐬',
		'🦉',
		'🐧',
		'⭐',
		'🌙',
		'☀️',
		'⚡',
		'🌊',
		'🍀',
		'🌵',
		'🌸',
		'🍄',
		'🔮',
		'💎',
		'👑',
		'🍕',
		'🍩',
		'🍉',
		'🍓',
		'🥑',
		'🌶️',
		'🚀',
		'⚽',
		'🎸',
		'🎲',
		'🧩',
		'🪁',
		'❤️',
		'💜',
		'💚',
		'💙',
		'🧡',
		'🖤',
		'👻',
		'🤖',
		'👾',
		'🎃',
		'🌻',
		'🍁'
	];

	let custom = $state('');
	const takenSet = $derived(new Set(taken.filter((t) => t !== value)));

	/** The first grapheme cluster of the text: one emoji, even a multi-codepoint one. */
	function firstGrapheme(text: string): string {
		const trimmed = text.trim();
		if (!trimmed) return '';
		const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
		return seg.segment(trimmed)[Symbol.iterator]().next().value?.segment ?? '';
	}

	const customMark = $derived(firstGrapheme(custom));
	const customError = $derived(
		customMark && takenSet.has(customMark) ? 'Another player has that mark.' : ''
	);
</script>

<div class="picker">
	<div class="grid" role="radiogroup" aria-label="Mark">
		{#each SHORTLIST as mark (mark)}
			<button
				type="button"
				role="radio"
				class="opt"
				aria-checked={value === mark}
				aria-label={mark}
				disabled={takenSet.has(mark)}
				onclick={() => (value = mark)}>{mark}</button
			>
		{/each}
	</div>
	<label class="custom">
		<span>Or paste any emoji</span>
		<input
			type="text"
			bind:value={custom}
			maxlength="16"
			placeholder="😺"
			aria-describedby="mark-error"
		/>
		<button
			type="button"
			class="btn small"
			disabled={!customMark || !!customError}
			onclick={() => {
				value = customMark;
				custom = '';
			}}>Use {customMark}</button
		>
	</label>
	<p id="mark-error" class="error" aria-live="polite">{customError}</p>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
		gap: 4px;
	}
	.opt {
		aspect-ratio: 1;
		border: 2px solid transparent;
		border-radius: var(--radius);
		background: var(--surface-2);
		font-family: var(--emoji);
		font-size: 22px;
		cursor: pointer;
		&:hover:not(:disabled) {
			border-color: var(--accent);
		}
		&[aria-checked='true'] {
			border-color: var(--accent);
			background: var(--accent-soft);
		}
		&:disabled {
			opacity: 0.25;
			cursor: not-allowed;
		}
	}
	.custom {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
		margin-top: var(--space-3);
		color: var(--fg-muted);
		input {
			width: 6ch;
			font-family: var(--emoji);
			font-size: 18px;
			text-align: center;
		}
	}
	.error {
		min-height: 1.2em;
		margin: var(--space-1) 0 0;
		color: var(--danger);
		font-size: 13px;
	}
</style>
