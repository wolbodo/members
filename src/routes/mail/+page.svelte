<script lang="ts">
	import { datetime } from '$lib/format';
	import Table from '$lib/Table.svelte';
	import { searchValue, filterFields } from '$lib/Header/index.svelte';
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();
</script>

<h1>Mails</h1>

<Table>
	<thead>
		<tr>
			<th>Status</th>
			<th>To</th>
			<th>Template</th>
			<th>Time</th>
		</tr>
	</thead>
	{#each data.mails.filter((mail) =>
		filterFields($searchValue, mail.personName, mail.personEmail, mail.status ?? undefined, mail.template)
	) as { status, personName, personEmail, template, created }}
		<tr>
			<td>{status}</td>
			<td><a href="mailto:{personEmail}">{personName}</a></td>
			<td>{template}</td>
			<td>{datetime(String(created))}</td>
		</tr>
	{:else}
		<tr><td colspan="4">No data</td></tr>
	{/each}
</Table>
