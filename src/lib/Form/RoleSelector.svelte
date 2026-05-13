<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatDate } from '$lib/format';

	interface Role {
		id: number;
		role: string;
		valid_from: Date | string | null;
		valid_till: Date | string | null;
	}

	interface Props {
		personId: number;
		roles: Role[];
		readonly?: boolean;
	}

	let { personId, roles, readonly = false }: Props = $props();

	const currentRoles = $derived(
		roles
			.filter((r) => !r.valid_till)
			.sort((a, b) => String(b.valid_from ?? '').localeCompare(String(a.valid_from ?? '')))
	);

	const pastRoles = $derived(
		roles
			.filter((r) => r.valid_till)
			.sort((a, b) => String(b.valid_from ?? '').localeCompare(String(a.valid_from ?? '')))
	);

	let newRole = $state('');
</script>

<section class="wide">
	<label>Roles</label>

	{#if !readonly}
		<form method="POST" action="?/addRole" use:enhance>
			<input type="hidden" name="personId" value={personId} />
			<input bind:value={newRole} name="role" placeholder="Add role" />
			<button type="submit">Add</button>
		</form>
	{/if}

	<ul class="roles">
		{#each currentRoles as role}
			<li>
				<span>{role.role} since {formatDate(String(role.valid_from ?? ''))}</span>
				{#if !readonly}
					<form method="POST" action="?/stopRole" use:enhance>
						<input type="hidden" name="roleId" value={role.id} />
						<button type="submit">Stop</button>
					</form>
				{/if}
			</li>
		{:else}
			<li>No current roles</li>
		{/each}

		{#if pastRoles.length}
			<li>Past roles:</li>
			{#each pastRoles as { role, valid_from, valid_till }}
				<li>
					<span>{role}</span>
					<span
						>from {formatDate(String(valid_from ?? ''))} until {formatDate(
							String(valid_till ?? '')
						)}</span
					>
				</li>
			{/each}
		{/if}
	</ul>
</section>

<style>
	section {
		--margin: 0.5rem;
	}
	.roles {
		padding: 0;
		margin: var(--margin);
	}
	.roles li {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	form {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	form input {
		flex: 1;
	}
</style>
