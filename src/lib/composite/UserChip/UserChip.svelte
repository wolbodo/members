<script lang="ts">
	import type { Snippet } from 'svelte';
	import Avatar from '../../primitives/Avatar/Avatar.svelte';
	import Dropdown from '../Dropdown/Dropdown.svelte';

	interface Props {
		name: string;
		menu?: Snippet;
	}

	let { name, menu }: Props = $props();

	let open = $state(false);
	let root = $state<HTMLDivElement>();

	function toggle() {
		open = !open;
	}

	$effect(() => {
		if (!open) return;

		function onDocClick(e: MouseEvent) {
			if (root && !root.contains(e.target as Node)) open = false;
		}
		document.addEventListener('mousedown', onDocClick);
		return () => document.removeEventListener('mousedown', onDocClick);
	});
</script>

<div class="wrap" bind:this={root}>
	<button class="uc" type="button" onclick={toggle} aria-expanded={open}>
		<Avatar initial={name.charAt(0)} />
		<span class="name">{name}</span>
		<svg class="caret" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
			<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
		</svg>
	</button>
	{#if open && menu}
		<div class="menu">
			<Dropdown>{@render menu()}</Dropdown>
		</div>
	{/if}
</div>

<style>
	.wrap {
		position: relative;
		display: inline-block;
	}
	.uc {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 10px 4px 5px;
		border-radius: var(--r-pill);
		border: 1px solid var(--bd);
		cursor: pointer;
		transition: all var(--t-fast);
		user-select: none;
		background: none;
		color: var(--txt);
		font-family: var(--font-body);
	}
	.uc:hover {
		border-color: var(--bd-m);
		background: var(--bg-s);
	}
	.name {
		font-size: var(--text-md);
		font-weight: 500;
	}
	.caret {
		opacity: 0.4;
	}
	@media (max-width: 600px) {
		.uc {
			padding: 4px 8px 4px 4px;
		}
		.name {
			display: none;
		}
	}
	.menu {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		z-index: 400;
	}
</style>
