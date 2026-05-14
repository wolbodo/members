<script lang="ts">
	import { roleTagColorStyle, type RoleName } from '../../roles';

	interface Props {
		role: RoleName | string;
		since?: string;
		onremove?: () => void;
	}

	let { role, since, onremove }: Props = $props();
</script>

<span class="tag" style={roleTagColorStyle(role)}>
	<span class="name">{role}</span>
	{#if since}<span class="since">since {since}</span>{/if}
	{#if onremove}
		<button type="button" class="rm" onclick={onremove} aria-label="Remove role">×</button>
	{/if}
</span>

<style>
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 5px 12px;
		border-radius: var(--r-pill);
		border: 1px solid;
		font-size: var(--text-md);
		font-weight: 600;
		transition: all var(--t-fast);
		font-family: var(--font-body);
	}
	.name {
		font-weight: 700;
	}
	.since {
		font-size: var(--text-xs);
		font-weight: 400;
		opacity: 0.65;
	}
	.rm {
		background: none;
		border: none;
		color: currentColor;
		font-size: 15px;
		line-height: 1;
		cursor: pointer;
		opacity: 0;
		padding: 0 0 0 2px;
		transition: opacity var(--t-fast);
	}
	.tag:hover .rm {
		opacity: 0.6;
	}
	.rm:hover {
		opacity: 1;
	}
</style>
