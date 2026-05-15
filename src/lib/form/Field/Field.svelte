<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		span2?: boolean;
		error?: string;
		children: Snippet;
	}

	let { label, span2 = false, error, children }: Props = $props();
</script>

<div class="field" class:span2 class:has-error={!!error}>
	<span class="lbl">{label}</span>
	{@render children()}
	{#if error}
		<span class="err">{error}</span>
	{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 150px;
	}
	.span2 {
		grid-column: 1 / -1;
	}
	.lbl {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--txt3);
	}
	.err {
		font-size: var(--text-xs);
		color: var(--red);
		margin-top: 2px;
	}
	.has-error :global(.glass) {
		border-bottom-color: var(--red);
	}
</style>
