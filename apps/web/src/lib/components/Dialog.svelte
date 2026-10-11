<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * Modal dialog on the native <dialog> element: showModal() gives focus trapping, Escape and
	 * the top layer; closedby="any" adds light dismiss, with a click fallback where unsupported.
	 */
	let {
		open = $bindable(false),
		title,
		children,
		footer,
		dismissable = true,
		onclose
	}: {
		open?: boolean;
		title: string;
		children: Snippet;
		footer?: Snippet;
		dismissable?: boolean;
		onclose?: () => void;
	} = $props();

	let dialog = $state<HTMLDialogElement>();
	const titleId = `dlg-${Math.random().toString(36).slice(2, 8)}`;

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	});

	function backdropFallback(event: MouseEvent) {
		if (!dismissable || 'closedBy' in HTMLDialogElement.prototype) return;
		if (event.target !== dialog) return;
		const r = dialog.getBoundingClientRect();
		const inside =
			r.top <= event.clientY &&
			event.clientY <= r.bottom &&
			r.left <= event.clientX &&
			event.clientX <= r.right;
		if (!inside) dialog.close();
	}

	function cancel(event: Event) {
		if (!dismissable) event.preventDefault();
	}
</script>

<dialog
	bind:this={dialog}
	class="sheet"
	closedby={dismissable ? 'any' : 'none'}
	aria-labelledby={titleId}
	onclick={backdropFallback}
	oncancel={cancel}
	onclose={() => {
		open = false;
		onclose?.();
	}}
>
	<header>
		<h2 id={titleId}>{title}</h2>
		{#if dismissable}
			<button class="btn ghost icon" aria-label="Close" onclick={() => (open = false)}>
				<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
					<path
						d="M6 6l12 12M18 6L6 18"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		{/if}
	</header>
	<div class="body">
		{@render children()}
	</div>
	{#if footer}
		<footer>{@render footer()}</footer>
	{/if}
</dialog>

<style>
	h2 {
		font-size: 18px;
	}
</style>
