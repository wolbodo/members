<script lang="ts">
	import Button from '../../primitives/Button/Button.svelte';

	interface Props {
		state: 'dirty' | 'saved';
		message?: string;
		ondiscard?: () => void;
		onsave?: () => void;
		saveLabel?: string;
		discardLabel?: string;
	}

	let {
		state,
		message,
		ondiscard,
		onsave,
		saveLabel = 'Save changes',
		discardLabel = 'Discard'
	}: Props = $props();
</script>

{#if state === 'dirty'}
	<div class="sb">
		<span class="dot"></span>
		<span class="msg">{message ?? 'Unsaved changes'}</span>
		{#if ondiscard}<Button variant="ghost" onclick={ondiscard}>{discardLabel}</Button>{/if}
		{#if onsave}<Button variant="primary" onclick={onsave}>{saveLabel}</Button>{/if}
	</div>
{:else}
	<div class="sb ok">
		<span class="ok-msg">✓ {message ?? 'Saved'}</span>
	</div>
{/if}

<style>
	.sb {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		background: var(--bg-c);
		border: 1px solid var(--bd-h);
		border-radius: 12px;
		padding: 10px 14px 10px 16px;
		box-shadow: var(--shadow-float);
		white-space: nowrap;
	}
	.sb.ok {
		border-color: var(--pri-bd);
	}
	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--amber);
		flex-shrink: 0;
	}
	.msg {
		font-size: var(--text-md);
		color: var(--txt2);
	}
	.ok-msg {
		font-size: var(--text-md);
		color: var(--pri);
		font-weight: 600;
	}
</style>
