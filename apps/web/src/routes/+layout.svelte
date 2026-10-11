<script lang="ts">
	import '@fontsource-variable/mulish';
	import '../app.css';
	import { onMount } from 'svelte';
	import { prefs } from '#lib/prefs.svelte.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(() => {
		prefs.load();
		// Keep the theme in sync when another tab changes it.
		const sync = (e: StorageEvent) => e.key?.startsWith('sttt:') && prefs.load();
		addEventListener('storage', sync);
		return () => removeEventListener('storage', sync);
	});
</script>

{@render children()}
