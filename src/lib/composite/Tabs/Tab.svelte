<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		active?: boolean;
		count?: number;
		onclick?: () => void;
		children: Snippet;
	}

	let { active = false, count, onclick, children }: Props = $props();
</script>

<button class="tab" class:active type="button" role="tab" aria-selected={active} {onclick}>
	{@render children()}
	{#if count !== undefined}<span class="count">{count}</span>{/if}
</button>

<style>
	.tab {
		font-size: var(--text-base);
		font-weight: 500;
		color: var(--txt2);
		padding: 8px 16px;
		border: none;
		background: none;
		cursor: pointer;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		display: flex;
		align-items: center;
		gap: 7px;
		transition: all var(--t-fast);
		font-family: var(--font-body);
	}
	.tab:hover {
		color: var(--txt);
	}
	.tab.active {
		color: var(--txt);
		font-weight: 700;
		border-bottom-color: var(--pri);
	}
	.count {
		font-size: var(--text-xs);
		font-weight: 600;
		padding: 1px 7px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.07);
		color: var(--txt2);
	}
	.tab.active .count {
		background: var(--pri-bd);
		color: var(--pri);
	}
</style>
