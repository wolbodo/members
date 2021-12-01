<script lang="ts">
	import { slide } from 'svelte/transition';

	export let name: string;
	export let label: string = null;
	export let type: string | SvelteComponent = 'text';
	export let value: any = null;
	export let format: (any) => string = (value) => value;
	export let readonly: boolean = false;

	let _class;
	export { _class as class };

	let changed = false;
	$: if (value) {
		changed = false;
	}
</script>

<section class:changed class={_class}>
	<!-- {#if value || !readonly} -->
	<label transition:slide for={name}>{label || name}</label>
	{#if type === 'textarea'}
		<textarea
			transition:slide
			id={name}
			{readonly}
			{...$$restProps}
			on:change={() => (changed = true)}
		/>
	{:else if typeof type === 'string'}
		<input
			transition:slide
			class:changed
			value={value ? format(value) : ''}
			id={name}
			{readonly}
			{...$$restProps}
			on:change={() => (changed = true)}
		/>
	{:else}
		<svelte:component this={type} id={name} {...$$restProps} />
	{/if}
	<!-- {/if} -->
</section>

<style>
	label {
		user-select: none;
	}
	input,
	textarea {
		background: var(--tertiary-color);
		border-color: rgba(255, 255, 255, 0.1);
	}

	input:focus,
	section:hover input,
	.changed input {
		background: var(--pure-white);
		box-shadow: 0 0 5px 1px var(--accent-color);
	}
	section:hover input,
	.changed input {
		background: var(--pure-white);
		box-shadow: 0 0 5px 1px var(--quaternary-color);
	}

	input[readonly],
	input[readonly]:hover,
	section:hover input[readonly] {
		color: black;
		background: initial;
		padding: initial;
		box-shadow: none;
		border: none;
		padding-left: 1em;
	}

	.changed label {
		color: var(--quaternary-color);
	}
</style>
