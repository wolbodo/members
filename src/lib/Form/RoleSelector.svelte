<script lang="ts">
	import Select from 'svelte-select';
	import { formatDate } from '$lib/format';

	import { graphql, fragment, type PersonRoles, type PersonRoles$data } from '$houdini';

	export let person: PersonRoles;
	export let readonly: boolean = false;
	export let refetch: () => void;
	// export let options = [];

	let newRole = '';

	$: allRoles = graphql(`
		query AllRoles {
			roles: auth_person_role(distinct_on: role) {
				role
				id
			}
		}
	`);

	$: data = fragment(
		person,
		graphql`
			fragment PersonRoles on auth_person {
				roles {
					id
					role
					valid_from
					valid_till
				}
			}
		`
	);

	$: if (!readonly) {
		allRoles.fetch();
	}

	const stopRole = graphql(`
		mutation StopRole($id: Int!) {
			update_auth_person_role_by_pk(pk_columns: { id: $id }, _set: { valid_till: "NOW()" }) {
				id
			}
		}
	`);
	const createRole = graphql(`
		mutation CreateRole($personId: Int!, $role: String!) {
			insert_auth_person_role_one(object: { person_id: $personId, role: $role }) {
				id
			}
		}
	`);
	$: ({ roles } = $data || ({} as PersonRoles$data));

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
	$: possibleRoles = $allRoles.data?.roles.filter(
		({ role }) => !currentRoles.find((currentRole) => currentRole.role === role)
	);

	let filterText = '';
	let value: string = '';
	let items: { value: string; label: string; created: boolean }[] = [];
	$: if (possibleRoles) {
		items = possibleRoles.map(({ role }) => ({ value: role, label: role }));
	}

	async function handleSelect(event) {
		const role = event.detail.value.toLowerCase();

		// Check for duplicates
		if (!currentRoles.some((currentRole) => role === currentRole.role)) {
			await createRole.mutate({ personId: person.id, role }, { metadata: { isBoard: true } });
		}
		value = '';

		await refetch();
	}

	function handleFilter(e) {
		if (e.detail.length === 0 && filterText.length > 0) {
			const prev = items.filter((i) => !i.created);
			items = [...prev, { value: filterText, label: filterText, created: true }];
		}
	}
</script>

<section class="wide">
	<label>Roles</label>

	{#if !readonly}
		<Select {items} bind:value on:select={handleSelect} on:filter={handleFilter} bind:filterText>
			<div slot="item" let:item>
				{item.created ? 'Add new: ' : ''}
				{item.label}
			</div>
		</Select>
	{/if}

	{#if roles}
		<ul class="roles">
			{#each currentRoles as role}
				<li>
					<span>{role.role} since {formatDate(role.valid_from)}</span>

					{#if !readonly}
						<button
							type="button"
							on:click={async () => {
								await stopRole.mutate({ id: role.id }, { metadata: { isBoard: true } });
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
</section>

<style>
	section {
		--margin: 0.5rem;
	}
	section :global(input) {
		max-width: inherit;
	}
	.options {
		margin: 0;
		padding: 0.5rem;
		list-style: none;
		background: white;
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
</style>
