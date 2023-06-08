<script lang="ts">
	import type { PageData } from './$houdini';

	import { datetime } from '$lib/format';
	import Table from '$lib/Table.svelte';
	import { searchValue, filterFields } from '$lib/Header/index.svelte';

	export let data: PageData;

	$: ({ History } = data);
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
		{#each $History.data.history.filter( ({ author, person, role }) => filterFields($searchValue, author?.name, person?.name, role) ) as { timestamp, new_values, old_values, role, author, person }}
			<tr>
				<td>{datetime(timestamp)}</td>
				<td>{author?.name ?? ''}</td>
				<td>{person.name}</td>
				<td>{role}</td>
				<td>
					{#if old_values}
						{#each Object.entries(old_values) as [key, value]}
							<section>
								{#if key === 'password'}
									password
								{:else if value || new_values[key]}
									<b>{key}</b>: {value} -> {new_values[key]}
								{/if}
							</section>
						{/each}
					{:else}
						<section>Created: {JSON.stringify(new_values)}</section>
					{/if}
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
