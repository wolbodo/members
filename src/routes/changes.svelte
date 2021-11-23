<script lang='ts'>
  import { datetime } from '$lib/format';
  import { client, gql } from '$lib/graphql';
  import Table from '$lib/Table.svelte'
  import { searchValue, filterFields } from '$lib/Header/index.svelte'
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

  {#await client.request(gql`
    query {
      history: auth_history(order_by:{timestamp:desc}) {
        timestamp
        new_values old_values
        role
        author { name }
        person { name }
      }
    }`, {}, { 'X-Hasura-Role': 'board' }
  )}
    <tr><td colspan=5>Loading</td></tr>
  {:then { history }}
    {#each history
            .filter(({ author, person, role }) => filterFields($searchValue, author?.name, person?.name, role))
      as { timestamp, new_values, old_values, role, author, person }
    }
      <tr>
        <td>{datetime(timestamp)}</td>
        <td>{author?.name ?? ''}</td>
        <td>{person.name}</td>
        <td>{role}</td>
        <td>{
          Object
            .entries(old_values)
            .map(([key, value]) => key !== 'password' ? `${key}: ${value} -> ${new_values[key]}` : 'password')
          }
        </td>
      </tr>
    {/each}
  {/await}
</Table>