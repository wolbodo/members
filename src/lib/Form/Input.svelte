<script lang="ts">
	export let name: string;
	export let label: string | null = null;
	export let type: string = 'text';
	export let value: unknown = null;
	export let format: (value: unknown) => string = (value) => value as string;
	export let readonly: boolean = false;

	let _class: string | null = null;
	export { _class as class };

	let changed = false;
	$: if (value) {
		changed = false;
	}
</script>

<section class:changed class={_class}>
	{#if !readonly || value}
		{#if type !== 'hidden'}
			<label for={name}>{label || name}</label>
		{/if}

		{#if type === 'textarea'}
			<textarea {...$$restProps} {name} id={name} {readonly} on:change={() => (changed = true)} />
		{:else if typeof type === 'string'}
			<input
				id={name}
				{name}
				{type}
				{readonly}
				class:changed
				value={value ? format(value) : ''}
				on:change={() => (changed = true)}
				{...$$restProps}
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
