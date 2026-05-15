<script lang="ts">
	interface Props {
		field: string;
		oldValue: string | null | undefined;
		newValue: string | null | undefined;
	}

	let { field, oldValue, newValue }: Props = $props();

	let isPassword = $derived(field === 'password');
	let isRole = $derived(field === 'role');
</script>

<div class="line">
	{#if isRole}
		{#if !oldValue}
			<span class="label">added</span>
			<span class="new">{newValue}</span>
		{:else}
			<span class="label">removed</span>
			<span class="old">{oldValue}</span>
		{/if}
	{:else if isPassword}
		<span class="label">password changed</span>
	{:else}
		<span class="field">{field}: </span>
		{#if oldValue == null}
			<span class="null">null</span>
		{:else}
			<span class="old">{oldValue}</span>
		{/if}
		<span class="arrow"> → </span>
		{#if newValue == null}
			<span class="null">null</span>
		{:else}
			<span class="new">{newValue}</span>
		{/if}
	{/if}
</div>

<style>
	.line {
		font-size: var(--text-sm);
		line-height: 1.9;
		display: flex;
		align-items: baseline;
		gap: 6px;
		flex-wrap: wrap;
	}
	.label {
		color: var(--txt3);
	}
	.field {
		color: var(--txt2);
	}
	.old {
		color: var(--red);
		opacity: 0.75;
		font-size: 0.95em;
	}
	.arrow {
		color: var(--txt3);
		font-size: 0.9em;
	}
	.new {
		color: var(--pri);
		font-weight: 500;
	}
	.null {
		color: var(--txt3);
		font-style: italic;
		font-size: 0.9em;
	}
</style>
