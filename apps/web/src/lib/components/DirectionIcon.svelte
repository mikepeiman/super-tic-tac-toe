<script lang="ts">
	/** The four scoring directions as line icons (the legacy scoreboard used the same idea). */
	let { dir, size = 16 }: { dir: number; size?: number } = $props();

	const paths = [
		'M3 7h18M3 12h18M3 17h18',
		'M7 3v18M12 3v18M17 3v18',
		'M3 13L13 3M5 21L21 5M11 21l10-10',
		'M3 11L13 21M5 3l16 16M11 3l10 10'
	];
</script>

<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
	<path
		d={paths[dir]}
		stroke="currentColor"
		stroke-width="2.2"
		stroke-linecap="round"
		fill="none"
	/>
</svg>
