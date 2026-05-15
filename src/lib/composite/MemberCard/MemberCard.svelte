<script lang="ts">
	import Chip from '../../primitives/Chip/Chip.svelte';

	interface Props {
		name: string;
		fullName?: string;
		city?: string | null;
		email?: string | null;
		phone?: string | null;
		roles: string[];
		onclick?: () => void;
	}

	let { name, fullName, city, email, phone, roles, onclick }: Props = $props();

	let sub = $derived([fullName, city].filter(Boolean).join(' · '));
	let contact = $derived([email, phone].filter(Boolean).join(' · '));
</script>

<button class="card" type="button" {onclick}>
	<div class="top">
		<span class="name">{name}</span>
		<div class="roles">
			{#each roles as role (role)}
				<Chip {role} />
			{/each}
		</div>
	</div>
	{#if sub}<div class="sub">{sub}</div>{/if}
	{#if contact}<div class="contact">{contact}</div>{/if}
</button>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 0;
		background: var(--bg-s);
		border: 1px solid var(--bd);
		border-left: 3px solid var(--pri);
		border-radius: var(--r-lg);
		padding: 13px 14px;
		cursor: pointer;
		transition: all 0.1s;
		text-align: left;
		font-family: var(--font-body);
		color: var(--txt);
		width: 100%;
	}
	.card:hover {
		background: var(--bg-c);
	}
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 3px;
	}
	.name {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--pri);
		flex-shrink: 0;
	}
	.roles {
		display: flex;
		gap: 3px;
		flex-wrap: nowrap;
		justify-content: flex-end;
	}
	.sub {
		font-size: var(--text-sm);
		color: var(--txt2);
		line-height: 1.4;
	}
	.contact {
		font-size: var(--text-sm);
		color: var(--txt2);
		margin-top: 5px;
	}
</style>
