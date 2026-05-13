<script lang="ts">
	interface Props {
		name: string;
		label?: string | null;
		type?: string;
		value?: unknown;
		format?: (value: unknown) => string;
		readonly?: boolean;
		class?: string | null;
		[key: string]: unknown;
	}

	let {
		name,
		label = null,
		type = 'text',
		value = null,
		format = (v) => v as string,
		readonly = false,
		class: className = null,
		...rest
	}: Props = $props();

	let changed = $state(false);

	$effect(() => {
		if (value) changed = false;
	});
</script>

<section class:changed class={className}>
	{#if !readonly || value || 'checked' in rest}
		{#if type !== 'hidden'}
			<label for={name}>{label || name}</label>
		{/if}

		{#if type === 'textarea'}
			<textarea
				{...rest}
				{name}
				id={name}
				{readonly}
				onchange={() => (changed = true)}
			></textarea>
		{:else}
			<input
				id={name}
				{name}
				{type}
				{readonly}
				class:changed
				value={value ? format(value) : ''}
				onchange={() => (changed = true)}
				{...rest}
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
		color: var(--primary-color);
	}
</style>
