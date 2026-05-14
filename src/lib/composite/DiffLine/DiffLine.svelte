<script lang="ts">
	interface Props {
		field: string;
		oldValue: string | null | undefined;
		newValue: string | null | undefined;
	}

	let { field, oldValue, newValue }: Props = $props();

	let isPassword = $derived(field === 'password');
</script>

<div class="line">
	<span class="field">{field}: </span>
	{#if isPassword}
		<span class="pass">•••• → ••••</span>
	{:else}
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
		gap: 3px;
		flex-wrap: wrap;
	}
	.field {
		color: var(--txt2);
	}
	.old {
		color: var(--red);
		opacity: 0.75;
		font-size: var(--text-xs);
	}
	.arrow {
		color: var(--txt3);
	}
	.new {
		color: var(--pri);
		font-size: var(--text-xs);
	}
	.null {
		color: var(--txt3);
		font-style: italic;
	}
	.pass {
		color: var(--txt3);
		letter-spacing: 0.12em;
	}
</style>
