<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		maxWidth?: string;
	}

	let { children, maxWidth = '1240px' }: Props = $props();
</script>

<main class="shell" style:max-width={maxWidth}>
	<div class="page">{@render children()}</div>
</main>

<style>
	.shell {
		flex: 1;
		padding: 32px 28px;
		width: 100%;
		margin: 0 auto;
	}
	.page {
		animation: pageIn 0.18s ease;
	}
	@keyframes pageIn {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (max-width: 600px) {
		.shell {
			padding: 20px 14px;
		}
	}
</style>
