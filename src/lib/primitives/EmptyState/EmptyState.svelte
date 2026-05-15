<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="empty">{@render children()}</div>

<style>
	.empty {
		text-align: center;
		padding: 64px 24px;
		color: var(--txt3);
		font-size: var(--text-base);
	}
</style>
