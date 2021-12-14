<script context="module" lang="ts">
	// This is the function for the AllItems query.
	// Query variable functions must be named <QueryName>Variables.
	export function AllPeopleVariables({ props }): AllPeople$input {
		return {
			where: props.where
		};
	}
</script>

<script lang="ts">
	import { query, graphql, AllPeople } from '$houdini';
	import { goto } from '$app/navigation';

	import Table from '$lib/Table.svelte';
	import { searchValue, filterFields } from '$lib/Header/index.svelte';

	// load the items
	const { data, loading } = query<AllPeople>(graphql`
		query AllPeople($where: auth_person_bool_exp = {}) {
			people: auth_person(order_by: { name: asc }, where: $where) {
				name
				email
				phone
				address
				city
				firstname
				lastname
				roles(where: { valid_till: { _is_null: true }, valid_from: { _lte: "NOW()" } }) {
					role
				}
			}
		}
	`);

	type Column = {
		label: string;
		href?: (object) => string;
		format: (object) => string;
	};
	const columns: Column[] = [
		{ label: 'Name', format: ({ name }) => name, href: ({ name }) => `m/${name.toLowerCase()}` },
		{ label: 'Email', format: ({ email }) => email },
		{ label: 'Phone', format: ({ phone }) => phone },
		{
			label: 'Address',
			format: ({ address, city }) => `${address ?? ''} ${city ?? ''}`.trim()
		},
		{
			label: 'Full name',
			format: ({ firstname, lastname }) => `${firstname ?? ''} ${lastname ?? ''}`.trim()
		},
		{
			label: 'Roles',
			format: ({ roles }) => roles.map(({ role }) => role)
		}
	];
</script>

<Table>
	<thead>
		<tr>
			{#each columns as { label }}
				<th>{label}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#if $loading}
			<tr class="ssc-line" />
		{:else}
			{#each $data.people.filter( (person) => filterFields($searchValue, person.name, person.firstname, person.lastname, person.email) ) as person}
				<tr
					on:click={(e) => {
						e.stopPropagation();

						if (!e.target.hasAttribute('href')) {
							goto(`/m/${person.name.toLowerCase()}`);
						}
					}}
				>
					{#each columns as { href, format }}
						<td>
							{#if href}
								<a sveltekit:prefetch href={href(person)}>
									{format(person) ?? ''}
								</a>
							{:else}
								{format(person) ?? ''}
							{/if}
						</td>
					{/each}
				</tr>
			{:else}
				<tr>
					<td colspan="3">There are no people. <a href="create">Create a new one.</a></td>
				</tr>
			{/each}
		{/if}
	</tbody>
</Table>

<style>
	td > a {
		font-weight: 700;
		color: var(--primary-2);
	}
</style>
