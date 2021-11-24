<script lang="ts">
	import { query, graphql, AllMail } from '$houdini';

	import { datetime } from '$lib/format';
	import Table from '$lib/Table.svelte';
	import { searchValue, filterFields } from '$lib/Header/index.svelte';

	const { data, loading } = query<AllMail>(graphql`
		query AllMail {
			mails: mail_entries(order_by: { created: desc }, limit: 100) {
				id
				status
				person {
					name
					email
				}
				template
				created
			}
		}
	`);
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
	{#if $loading}
		<tr><td colspan="4">Loading</td></tr>
	{:else}
		{#each $data.mails.filter( (mail) => filterFields($searchValue, mail.person.name, mail.person.email, mail.status, mail.template) ) as { status, person, template, created }}
			<tr>
				<td>{status}</td>
				<td><a href="mailto:{person.email}">{person.name}</a></td>
				<td>{template}</td>
				<td>{datetime(created)}</td>
			</tr>
		{/each}
	{/if}
</Table>
