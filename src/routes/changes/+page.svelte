<script lang="ts">
	import type { PageData } from './$houdini';

	import { datetime } from '$lib/format';
	import Table from '$lib/Table.svelte';
	import { searchValue, filterFields } from '$lib/Header/index.svelte';

	export let data: PageData;

	$: ({ History } = data);

	const hiddenFields = ['password'];

	const changes = (
		old_value: object | null,
		new_value: object | null
	): (string | [string, unknown])[] => {
		if (!old_value) {
			return Object.entries(new_value ?? {})
				.filter(([, value]) => Boolean(value))
				.map(([key, value]) => [key, hiddenFields.includes(key) ? '****' : value]);
		}

		return Object.entries(old_value)
			.map(([key, value]) => {
				if (value === new_value?.[key]) {
					return null;
				}

				return [key, `${value} -> ${new_value?.[key]}`];
			})
			.map(([key, value]) => [key, hiddenFields.includes(key) ? '****' : value])
			.filter(Boolean) as (string | [string, unknown])[];
	};
</script>

<h1>Changes</h1>

<Table>
	<thead>
		<tr>
			<th>Time</th>
			<th>Author</th>
			<th>Person</th>
			<th>Role</th>
			<th>Changes</th>
		</tr>
	</thead>

	{#if $History.fetching}
		<tr><td colspan="5">Loading</td></tr>
	{:else if $History.errors}
		{#each $History.errors as error}
			<tr><td colspan="5">Loading</td></tr>
		{/each}
	{:else if $History.data}
		{#each $History.data.history
			.filter((v) => Boolean(v))
			.filter( ({ author, person, role }) => filterFields($searchValue, author?.name, person?.name, role) ) as { timestamp, new_values, old_values, role, author, person }}
			<tr>
				<td>{datetime(timestamp)}</td>
				<td>{author?.name ?? ''}</td>
				<td>{person.name}</td>
				<td>{role}</td>
				<td>
					{#each changes(old_values, new_values) as change}
						{#if typeof change === 'string'}
							<section>{change}</section>
						{:else}
							<section><b>{change[0]}</b>: {change[1]}</section>
						{/if}
					{/each}
				</td>
			</tr>
		{/each}
	{:else}
		<tr><td colspan="5">No data yet</td></tr>
	{/if}
</Table>

<style>
	td {
		white-space: nowrap;
	}
</style>
