<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		checked: boolean;
		children?: Snippet;
		onchange?: (e: Event) => void;
		[key: string]: unknown;
	}

	let { checked = $bindable(), children, onchange, ...rest }: Props = $props();
</script>

<label>
	<section>
		<input type="checkbox" bind:checked {onchange} {...rest} />
		<span></span>
	</section>
	{@render children?.()}
</label>

<style>
	label {
		display: inline-block;
		line-height: 34px;
	}
	section {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}
	section input {
		opacity: 0;
		width: 0;
		height: 0;
	}
	span {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--neutral-4);
		transition: 0.4s;
	}
	span:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: var(--white);
		transition: 0.4s;
	}
	input:checked + span {
		background-color: var(--primary-color);
	}
	input:focus + span {
		box-shadow: 0 0 1px var(--primary-color);
	}
	input:checked + span:before {
		transform: translateX(26px);
	}
</style>
