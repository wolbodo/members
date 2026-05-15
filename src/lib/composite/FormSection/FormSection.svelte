<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		children: Snippet;
	}

	let { label, children }: Props = $props();
</script>

<section class="sec">
	<span class="lbl">{label}</span>
	<div class="grid">{@render children()}</div>
</section>

<style>
	.sec {
		display: grid;
		grid-template-columns: 160px 1fr;
		gap: 16px;
		padding: 20px 0;
		border-bottom: 1px solid var(--bd);
		align-items: start;
	}
	.sec:last-child {
		border-bottom: none;
	}
	.lbl {
		font-size: var(--text-xs);
		font-weight: 700;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--txt3);
		padding-top: 6px;
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px 24px;
	}
	@media (max-width: 600px) {
		.sec {
			grid-template-columns: 76px 1fr;
			gap: 8px;
			padding: 14px 0;
		}
		.grid {
			gap: 4px 12px;
		}
	}
</style>
