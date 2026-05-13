<script lang="ts">
	import { goto } from '$app/navigation';

	import Table from '$lib/Table.svelte';
	import { searchValue, filterFields } from '$lib/Header/index.svelte';

	interface Person {
		id: number;
		name: string;
		email: string | null;
		phone: string | null;
		address: string | null;
		city: string | null;
		firstname: string | null;
		lastname: string | null;
		roles: { role: string }[];
	}

	interface Props {
		people?: Person[];
		fetching?: boolean;
	}

	let { people = [], fetching = true }: Props = $props();

	type Column = {
		label: string;
		link?: (data: Person) => string;
		format: (data: Person) => string;
	};

	const link = ({ id, name, roles }: Person): string =>
		roles.find(({ role }) => role === 'member') ? `m/${name.toLowerCase()}` : `m/${id}`;

	const columns: Column[] = [
		{ label: 'Name', format: ({ name }) => name, link },
		{ label: 'Email', format: ({ email }) => email ?? '' },
		{ label: 'Phone', format: ({ phone }) => phone ?? '' },
		{ label: 'Address', format: ({ address, city }) => `${address ?? ''} ${city ?? ''}`.trim() },
		{
			label: 'Full name',
			format: ({ firstname, lastname }) => `${firstname ?? ''} ${lastname ?? ''}`.trim()
		},
		{ label: 'Roles', format: ({ roles }) => roles.map(({ role }) => role).join(', ') }
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
			<tr class="ssc-line"></tr>
		{:else}
			{#each people.filter((p) =>
				filterFields($searchValue, p.name, p.firstname ?? undefined, p.lastname ?? undefined, p.email ?? undefined)
			) as person}
				<tr
					onclick={(e) => {
						e.stopPropagation();
						if (!(e.target instanceof HTMLAnchorElement)) goto(link(person));
					}}
				>
					{#each columns as { link: colLink, format }}
						<td>
							{#if colLink}
								<a href={colLink(person)}>{format(person) ?? ''}</a>
							{:else}
								{format(person) ?? ''}
							{/if}
						</td>
					{/each}
				</tr>
			{:else}
				<tr>
					<td colspan="6">There are no people. <a href="create">Create a new one.</a></td>
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
