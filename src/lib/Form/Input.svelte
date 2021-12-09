<script lang="ts">
	import { slide } from 'svelte/transition';

	export let name: string;
	export let label: string = null;
	export let type: string = 'text';
	export let value: any = null;
	export let format: (any) => string = (value) => value;
	export let readOnly: boolean = false;

	let _class;
	export { _class as class };

	let changed = false;
	$: if (value) {
		changed = false;
	}
</script>

<section class:changed class={_class}>
	{#if value || !readOnly}
		<label transition:slide for={name}>{label || name}</label>
		{#if type === 'textarea'}
			<textarea
				transition:slide
				id={name}
				{readOnly}
				{...$$props}
				on:change={() => (changed = true)}
			/>
		{:else if typeof type === 'string'}
			<input
				transition:slide
				class:changed
				value={value ? format(value) : ''}
				id={name}
				{readOnly}
				{...$$props}
				on:change={() => (changed = true)}
			/>
		{/if}
	{/if}
</section>

<style>
	label {
		user-select: none;
	}
	input,
	textarea {
		background: var(--white);
		border-color: var(--neutral-4);
	}

	input:focus,
	section:hover input,
	.changed input {
		background: var(--pure-white);
		box-shadow: 0 0 5px 1px var(--info-color);
	}
	section:hover input,
	.changed input {
		background: var(--pure-white);
		box-shadow: 0 0 5px 1px var(--primary-color);
	}

	input[readOnly],
	input[readOnly]:hover,
	section:hover input[readOnly] {
		color: black;
		background: initial;
		padding: initial;
		box-shadow: none;
		border: none;
		padding-left: 1em;
	}

	.changed label {
		color: var(--primary-color);
	}
</style>
