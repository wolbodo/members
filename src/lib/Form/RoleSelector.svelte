<script lang="ts">
	import { getContext } from 'svelte';
	import { formatDate } from '$lib/util';

	import {
		graphql,
		query,
		mutation,
		fragment,
		RoleSelector,
		StopRole,
		CreateRole,
		AllRolesForOptions
	} from '$houdini';

	export let roles;
	export let personId: number;
	export let refetch;
	export let readOnly: boolean = false;
	export let options = [];

	const { data: rolesData } = query<AllRolesForOptions>(graphql`
		query AllRolesForOptions {
			auth_person_role(distinct_on: role) {
				role
			}
		}
	`);

	const data = fragment<RoleSelector>(
		graphql`
			fragment RoleSelector on auth_person {
				roles {
					id
					role
					valid_from
					valid_till
				}
			}
		`,
		roles
	);
	const stopRole = mutation<StopRole>(graphql`
		mutation StopRole($id: Int!) {
			update_auth_person_role_by_pk(pk_columns: { id: $id }, _set: { valid_till: "NOW()" }) {
				id
			}
		}
	`);
	const createRole = mutation<CreateRole>(graphql`
		mutation CreateRole($personId: Int!, $role: String!) {
			insert_auth_person_role_one(object: { person_id: $personId, role: $role }) {
				id
			}
		}
	`);

	$: {
		console.log('roles', roles, $data);
	}

	let newRoleName = '';
	$: currentRoles = roles
		? roles
				.filter(({ valid_till }) => !valid_till)
				.sort(({ valid_from: a }, { valid_from: b }) => b - a)
		: [];
	$: pastRoles = roles
		? roles
				.filter(({ valid_till }) => valid_till)
				.sort(({ valid_from: a }, { valid_from: b }) => b - a)
		: [];
	$: possibleRoles = $rolesData?.auth_person_role;
	$: {
		console.log(possibleRoles);
	}
	// $: possibleRoles = $rolesData?.auth_person_role.filter((opt) => !currentRoles
	// 							.map(({ role }) => role)
	// 							.includes(opt) && opt.match(newRoleName))

	const submitForm = (e) => {
		e.preventDefault();
		e.stopPropagation();
		console.log('Stopped form', newRoleName);

		createRole(personId, newRoleName.toLowerCase());
		newRoleName = '';
	};
</script>

<form on:submit={submitForm}>
	{#if !readOnly}
		<section>
			<input type="text" bind:value={newRoleName} placeholder="type to add a role" />
			{newRoleName}
			{#if newRoleName}
				<ul class="options">
					{#each possibleRoles as option}
						<li>
							<button
								type="button"
								on:click={(e) => {
									newRoleName = option;
									submitForm(e);
								}}
							>
								{option}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	{/if}
</form>

{#if roles}
	<ul class="roles">
		{#each currentRoles as role}
			<li>
				<span>{role.role} since {formatDate(role.valid_from)}</span>

				{#if !readOnly}
					<button
						type="button"
						on:click={async () => {
							await stopRole({ id: role.id });
							await refetch();
						}}>Stop</button
					>
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

					<span>from {formatDate(valid_from)} until {formatDate(valid_till)}</span>
				</li>
			{/each}
		{/if}
	</ul>
{/if}

<style>
	.options {
		margin: 0;
		padding: 0.5rem;
		list-style: none;
		background: white;
	}

	.roles {
		padding: 0;
	}
	.roles li {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
