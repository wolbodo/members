<script lang="ts">
	import DiffLine from '../DiffLine/DiffLine.svelte';

	interface DiffField {
		field: string;
		old: string | null;
		new: string | null;
	}

	import type { Snippet } from 'svelte';

	interface Props {
		author: string;
		time: string;
		fields: DiffField[];
		children?: Snippet;
	}

	let { author, time, fields, children }: Props = $props();
</script>

<div class="card">
	<div class="hd">
		<span class="author">{author}</span>
		<span class="time">{time}</span>
	</div>
	<div class="body">
		{@render children?.()}
		{#each fields as f (f.field)}
			<DiffLine field={f.field} oldValue={f.old} newValue={f.new} />
		{/each}
	</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: var(--bg-s);
		border: 1px solid var(--bd);
		border-radius: var(--r-lg);
		padding: 13px 14px;
		cursor: default;
	}
	.hd {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 8px;
	}
	.author {
		font-size: var(--text-md);
		font-weight: 600;
		color: var(--pri);
	}
	.time {
		font-size: var(--text-xs);
		color: var(--txt3);
	}
	.body {
		border-top: 1px solid var(--bd);
		padding-top: 9px;
		margin-top: 8px;
	}
</style>
