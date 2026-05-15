<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		head: Snippet;
		body: Snippet;
		bare?: boolean;
	}

	let { head, body, bare = false }: Props = $props();
</script>

<div class="wrap" class:bare>
	<table>
		<thead>{@render head()}</thead>
		<tbody>{@render body()}</tbody>
	</table>
</div>

<style>
	.wrap {
		border: 1px solid var(--bd);
		border-radius: var(--r-lg);
		overflow: hidden;
		width: 100%;
	}
	.wrap.bare {
		border: none;
		border-radius: 0;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	.wrap :global(thead th) {
		background: var(--bg-s);
		color: var(--txt2);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 10px 14px;
		text-align: left;
		border-bottom: 1px solid var(--bd);
	}
	.wrap :global(tbody tr) {
		border-bottom: 1px solid var(--bd);
		transition: background 0.1s;
	}
	.wrap :global(tbody tr:last-child) {
		border-bottom: none;
	}
	.wrap :global(tbody tr.clickable) {
		cursor: pointer;
		outline: none;
	}
	.wrap :global(tbody tr.clickable:hover),
	.wrap :global(tbody tr.clickable:focus-within) {
		background: var(--bg-h);
	}
	.wrap :global(td) {
		padding: 10px 14px;
		font-size: var(--text-md);
		vertical-align: middle;
	}
	.wrap :global(.td-name) {
		color: var(--pri);
		font-weight: 600;
	}
	.wrap :global(.td-dim) {
		color: var(--txt2);
	}
</style>
