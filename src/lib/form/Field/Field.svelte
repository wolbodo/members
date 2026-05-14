<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		span2?: boolean;
		children: Snippet;
	}

	let { label, span2 = false, children }: Props = $props();
</script>

<div class="field" class:span2>
	<span class="lbl">{label}</span>
	{@render children()}
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
</style>
