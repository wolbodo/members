<script lang="ts">
	// import { query, graphql, AllPeople } from '$houdini';
	import type { AllPeople$result } from '$houdini';
	import { goto } from '$app/navigation';

	import Table from '$lib/Table.svelte';
	import { searchValue, filterFields } from '$lib/Header/index.svelte';

	export let people: AllPeople$result['people'] = [];
	export let fetching: boolean = true;

	type Column = {
		label: string;
		href?: (data: any) => string;
		format: (data: any) => string;
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
		{#if fetching}
			<tr class="ssc-line" />
		{:else}
			{#each people.filter( (person) => filterFields($searchValue, person.name, person.firstname, person.lastname, person.email) ) as person}
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
								<a href={href(person)}>
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
