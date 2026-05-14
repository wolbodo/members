<script lang="ts">
	import { roleVar, type RoleName } from '../../roles';

	interface Props {
		name: string;
		realName?: string;
		since?: string;
		id?: string | number;
		primaryRole?: RoleName | string;
	}

	let { name, realName, since, id, primaryRole = 'member' }: Props = $props();
</script>

<header class="hd" style="border-left-color: {roleVar(primaryRole)};">
	<div class="main">
		<div class="name">{name}</div>
		{#if realName}<div class="real">{realName}</div>{/if}
	</div>
	{#if since || id}
		<div class="meta">
			{#if since}<span class="since">member since {since}</span>{/if}
			{#if id !== undefined}<span class="id">#{id}</span>{/if}
		</div>
	{/if}
</header>

<style>
	.hd {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		border-left: 3px solid transparent;
		padding-left: 16px;
		margin-bottom: 22px;
		transition: border-color 0.4s;
	}
	.main {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.name {
		font-size: var(--text-3xl);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1;
	}
	.real {
		font-size: 15px;
		font-weight: 400;
		color: var(--txt2);
	}
	.meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 4px;
	}
	.since {
		font-size: var(--text-sm);
		color: var(--txt2);
	}
	.id {
		font-size: var(--text-xs);
		color: var(--txt3);
	}
	@media (max-width: 600px) {
		.name {
			font-size: var(--text-2xl);
		}
		.hd {
			padding-left: 10px;
			flex-direction: column;
			gap: 6px;
		}
		.meta {
			flex-direction: row;
			gap: 12px;
			align-items: center;
		}
	}
</style>
