<script lang="ts">
	interface Props {
		initial: string;
		size?: number;
	}

	let { initial, size = 26 }: Props = $props();

	let fontSize = $derived(Math.max(10, Math.round(size * 0.46)));
</script>

<span class="av" style="width:{size}px; height:{size}px; font-size:{fontSize}px;">
	{initial}
</span>

<style>
	.av {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--pri-bd);
		color: var(--pri);
		font-weight: 700;
		flex-shrink: 0;
		font-family: var(--font-body);
		line-height: 1;
	}
</style>
