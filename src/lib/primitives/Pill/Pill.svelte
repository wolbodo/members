<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		active?: boolean;
		onclick?: () => void;
		children?: Snippet;
		[key: string]: unknown;
	}

	let { active = false, onclick, children }: Props = $props();
</script>

<button type="button" class="pill" class:active {onclick}>{@render children?.()}</button>

<style>
	.pill {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 600;
		padding: 3px 10px;
		border-radius: var(--r-pill);
		border: 1px solid var(--bd-m);
		background: none;
		color: var(--txt2);
		cursor: pointer;
		transition: all var(--t-fast);
		letter-spacing: 0.02em;
	}
	.pill:hover {
		color: var(--txt);
		border-color: var(--bd-h);
		background: rgba(255, 255, 255, 0.05);
	}
	.pill.active {
		color: var(--pri);
		border-color: var(--pri-bd);
		background: var(--pri-bg);
		font-weight: 700;
	}
</style>
