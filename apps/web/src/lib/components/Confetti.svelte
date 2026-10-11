<script lang="ts">
	import { prefs } from '../prefs.svelte.ts';

	/** A short shower of the winner's mark in the winner's colour (GDD section 8). */
	let { mark, color }: { mark: string; color: string } = $props();

	const pieces = Array.from({ length: 36 }, (_, i) => ({
		left: Math.random() * 100,
		delay: Math.random() * 0.8,
		duration: 1.6 + Math.random() * 1.1,
		size: 16 + Math.random() * 18,
		drift: (Math.random() - 0.5) * 120,
		spin: (Math.random() - 0.5) * 720,
		dot: i % 3 === 0
	}));

	let visible = $state(!prefs.reducedMotion);
	$effect(() => {
		const t = setTimeout(() => (visible = false), 3200);
		return () => clearTimeout(t);
	});
</script>

{#if visible}
	<div class="confetti" aria-hidden="true">
		{#each pieces as p, i (i)}
			<span
				class:dot={p.dot}
				style:left="{p.left}%"
				style:font-size="{p.size}px"
				style:--c={color}
				style:--drift="{p.drift}px"
				style:--spin="{p.spin}deg"
				style:animation-delay="{p.delay}s"
				style:animation-duration="{p.duration}s">{p.dot ? '' : mark}</span
			>
		{/each}
	</div>
{/if}

<style>
	.confetti {
		position: fixed;
		inset: 0;
		z-index: 2147483647;
		overflow: hidden;
		pointer-events: none;
	}
	span {
		position: absolute;
		top: -40px;
		font-family: var(--emoji);
		animation: fall linear forwards;
	}
	.dot {
		width: 10px;
		height: 14px;
		border-radius: 2px;
		background: var(--c);
	}
	@keyframes fall {
		to {
			transform: translate(var(--drift), 110vh) rotate(var(--spin));
		}
	}
</style>
