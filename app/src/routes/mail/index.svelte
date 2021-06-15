<script lang='ts'>
  import { DateTime } from 'luxon'
  import { client, gql } from '$lib/graphql';
  import Table from '$lib/Table.svelte'
  import { searchValue, filterFields } from '$lib/Header/index.svelte'
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

  {#await client.request(gql`
    query {
      mails: mail_entries(order_by: {created:desc}, limit: 100) {
        id status person { name email } 
        template created
      }
    }`, {}, { 'X-Hasura-Role': 'board' }
  )}
    <tr><td colspan=4>Loading</td></tr>
  {:then { mails }}
    {#each mails
            .filter(mail => filterFields($searchValue, mail.person.name, mail.person.email, mail.status, mail.template))
            .map( mail => ({...mail, created: DateTime.fromISO(mail.created) }))
      as { status, person, template, created }}
      <tr>
        <td>{status}</td>
        <td><a href='mailto:{person.email}'>{person.name}</a></td>
        <td>{template}</td>
        <td>
          {created.toLocaleString()}
          {created.toLocaleString(DateTime.TIME_24_SIMPLE)}
        </td>
      </tr>
    {/each}
  {/await}
</Table>