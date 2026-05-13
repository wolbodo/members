<script lang="ts">
	import { datetime } from '$lib/format';
	import Table from '$lib/Table.svelte';
	import { searchValue, filterFields } from '$lib/Header/index.svelte';
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

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
				if (value === (new_value as Record<string, unknown>)?.[key]) return null;
				return [key, `${value} -> ${(new_value as Record<string, unknown>)?.[key]}`];
			})
			.filter((item): item is string[] => item !== null)
			.map(([key, value]) => [key, hiddenFields.includes(key as string) ? '****' : value]) as [
			string,
			unknown
		][];
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

	{#each data.history.filter(({ author, person, role }) =>
		filterFields($searchValue, author?.name, person?.name, role ?? undefined)
	) as { timestamp, new_values, old_values, role, author, person }}
		<tr>
			<td>{datetime(String(timestamp))}</td>
			<td>{author?.name ?? ''}</td>
			<td>{person?.name}</td>
			<td>{role}</td>
			<td>
				{#each changes(old_values as object | null, new_values as object | null) as change}
					{#if typeof change === 'string'}
						<section>{change}</section>
					{:else}
						<section><b>{change[0]}</b>: {change[1]}</section>
					{/if}
				{/each}
			</td>
		</tr>
	{:else}
		<tr><td colspan="5">No data yet</td></tr>
	{/each}
</Table>

<style>
	td {
		white-space: nowrap;
	}
</style>
