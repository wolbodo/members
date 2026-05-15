<script lang="ts">
	interface Props {
		value: string | null | undefined;
		mono?: boolean;
	}

	let { value, mono = false }: Props = $props();

	let empty = $derived(value == null || value === '');
</script>

<div class="val" class:empty class:mono>
	{empty ? '—' : value}
</div>

<style>
	.val {
		font-size: var(--text-base);
		color: var(--txt);
		padding: 5px 3px;
		min-height: 28px;
	}
	.empty {
		color: var(--txt3);
	}
	.mono {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
	}
</style>
