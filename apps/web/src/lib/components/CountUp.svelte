<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { prefs } from '../prefs.svelte.ts';

	/** A number that counts up to its value, for the tally (GDD section 7). */
	let { value }: { value: number } = $props();

	const tween = new Tween(0, { duration: 700, easing: cubicOut });

	$effect(() => {
		void tween.set(value, { duration: prefs.reducedMotion ? 0 : 700 });
	});
</script>

<span class="num">{Math.round(tween.current)}</span>
