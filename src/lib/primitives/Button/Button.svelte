<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'outline' | 'ghost' | 'back';

	interface Props {
		variant?: Variant;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
		icon?: Snippet;
		children?: Snippet;
		[key: string]: unknown;
	}

	let {
		variant = 'primary',
		type = 'button',
		disabled = false,
		onclick,
		icon,
		children,
		...rest
	}: Props = $props();
</script>

<button class="btn btn-{variant}" class:disabled {type} {disabled} {onclick} {...rest}>
	{#if icon}{@render icon()}{/if}
	{@render children?.()}
</button>

<style>
	.btn {
		font-family: var(--font-body);
		font-size: var(--text-md);
		font-weight: 600;
		padding: var(--sp-2) var(--sp-4);
		border-radius: var(--r-md);
		border: none;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		white-space: nowrap;
		transition: all var(--t-fast);
	}
	.btn-primary {
		background: var(--pri);
		color: #111;
	}
	.btn-primary:hover:not(.disabled) {
		filter: brightness(1.1);
		box-shadow: var(--shadow-glow-pri);
	}
	.btn-outline {
		background: none;
		color: var(--txt2);
		border: 1px solid var(--bd-m);
	}
	.btn-outline:hover:not(.disabled) {
		color: var(--txt);
		border-color: var(--bd-h);
		background: rgba(255, 255, 255, 0.05);
	}
	.btn-ghost {
		background: none;
		border: none;
		color: var(--txt2);
		font-weight: 500;
		padding: 4px 0;
	}
	.btn-ghost:hover:not(.disabled) {
		color: var(--pri);
	}
	.btn-back {
		background: none;
		border: none;
		color: var(--txt3);
		font-size: var(--text-sm);
		font-weight: 500;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		padding: 0;
	}
	.btn-back:hover:not(.disabled) {
		color: var(--pri);
	}
	.disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
</style>
