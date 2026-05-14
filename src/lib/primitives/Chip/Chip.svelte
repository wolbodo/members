<script lang="ts">
	import { roleColorStyle, type RoleName } from '../../roles';

	interface Props {
		role: RoleName | string;
		onclick?: () => void;
	}

	let { role, onclick }: Props = $props();
</script>

{#if onclick}
	<button class="chip" style={roleColorStyle(role)} {onclick}>{role}</button>
{:else}
	<span class="chip" style={roleColorStyle(role)}>{role}</span>
{/if}

<style>
	.chip {
		display: inline-block;
		padding: 2px 8px;
		border-radius: var(--r-sm);
		font-size: var(--text-xs);
		font-weight: 600;
		border: 1px solid;
		white-space: nowrap;
		transition: filter var(--t-fast);
		font-family: var(--font-body);
	}
	button.chip {
		cursor: pointer;
	}
	button.chip:hover {
		filter: brightness(1.2);
	}
</style>
