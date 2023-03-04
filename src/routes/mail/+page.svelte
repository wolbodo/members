<script lang="ts">
	import type { PageData } from './$houdini';

	import { datetime } from '$lib/format';
	import Table from '$lib/Table.svelte';
	import { searchValue, filterFields } from '$lib/Header/index.svelte';

	export let data: PageData;

	$: ({ AllMail } = data);
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
	{#if $AllMail.fetching}
		<tr><td colspan="4">Loading</td></tr>
	{:else if $AllMail.data}
		{#each $AllMail.data.mails.filter( (mail) => filterFields($searchValue, mail.person.name, mail.person.email, mail.status, mail.template) ) as { status, person, template, created }}
			<tr>
				<td>{status}</td>
				<td><a href="mailto:{person.email}">{person.name}</a></td>
				<td>{template}</td>
				<td>{datetime(created)}</td>
			</tr>
		{/each}
	{:else}
		<tr><td colspan="4">No data</td></tr>
	{/if}
</Table>
