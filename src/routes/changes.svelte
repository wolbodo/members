<script lang="ts" context="module">
	export function onLoad({ page, session }) {
		session.currentRole = 'board';
	}
</script>

<script lang="ts">
	import { query, graphql, History } from '$houdini';

	import { datetime } from '$lib/format';
	import Table from '$lib/Table.svelte';
	import { searchValue, filterFields } from '$lib/Header/index.svelte';

	const { data, loading } = query<History>(graphql`
		query History {
			history: auth_history(order_by: { timestamp: desc }) {
				timestamp
				new_values
				old_values
				role
				author {
					name
				}
				person {
					name
				}
			}
		}
	`);
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

	{#if $loading}
		<tr><td colspan="5">Loading</td></tr>
	{:else}
		{#each $data.history.filter( ({ author, person, role }) => filterFields($searchValue, author?.name, person?.name, role) ) as { timestamp, new_values, old_values, role, author, person }}
			<tr>
				<td>{datetime(timestamp)}</td>
				<td>{author?.name ?? ''}</td>
				<td>{person.name}</td>
				<td>{role}</td>
				<td>
					{#each Object.entries(old_values) as [key, value]}
						<span>
							{#if key === 'password'}
								password
							{:else}
								{key}: {value} -> {new_values[key]}
							{/if}
						</span>
					{/each}
				</td>
			</tr>
		{/each}
	{/if}
</Table>

<style>
	td {
		white-space: nowrap;
	}
</style>
