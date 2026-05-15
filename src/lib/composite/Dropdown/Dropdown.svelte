<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		anchor?: 'left' | 'right';
	}

	let { children, anchor = 'right' }: Props = $props();
</script>

<div class="dd" class:left={anchor === 'left'} role="menu">
	{@render children()}
</div>

<style>
	.dd {
		background: var(--bg-c);
		border: 1px solid var(--bd-m);
		border-radius: 9px;
		padding: 5px;
		min-width: 150px;
		box-shadow: var(--shadow-dropdown);
	}
	.dd :global(button),
	.dd :global(a) {
		display: block;
		width: 100%;
		text-align: left;
		padding: 8px 12px;
		background: none;
		border: none;
		color: var(--txt);
		font-size: var(--text-md);
		cursor: pointer;
		border-radius: 6px;
		font-family: var(--font-body);
		transition: background 0.1s;
		text-decoration: none;
		box-sizing: border-box;
	}
	.dd :global(button:hover),
	.dd :global(a:hover) {
		background: var(--bg-h);
	}
	.dd :global(button.danger),
	.dd :global(a.danger) {
		color: var(--red);
	}
	.dd :global(hr) {
		border: none;
		border-top: 1px solid var(--bd);
		margin: 4px 0;
	}
</style>
