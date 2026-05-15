<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		checked: boolean;
		disabled?: boolean;
		children?: Snippet;
		onchange?: (e: Event) => void;
		[key: string]: unknown;
	}

	let { checked = $bindable(), disabled = false, children, onchange, ...rest }: Props = $props();
</script>

<label class="tog" class:disabled>
	<input type="checkbox" class="visually-hidden" bind:checked {disabled} {onchange} {...rest} />
	<span class="track" class:on={checked}>
		<span class="thumb"></span>
	</span>
	{#if children}
		<span class="lbl" class:on={checked}>{@render children()}</span>
	{/if}
</label>

<style>
	.tog {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		user-select: none;
		cursor: pointer;
	}
	.tog.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.track {
		width: 34px;
		height: 19px;
		border-radius: 10px;
		background: var(--bg-c);
		border: 1px solid var(--bd-m);
		position: relative;
		transition: all var(--t-slow);
		flex-shrink: 0;
	}
	.track.on {
		background: var(--pri);
		border-color: var(--pri);
	}
	.thumb {
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: var(--txt2);
		position: absolute;
		top: 2px;
		left: 2px;
		transition: all var(--t-slow);
	}
	.track.on .thumb {
		transform: translateX(15px);
		background: #111;
	}
	input:focus-visible + .track {
		box-shadow: 0 0 0 3px var(--pri-bg);
	}
	.lbl {
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--txt2);
	}
	.lbl.on {
		color: var(--txt);
	}
</style>
