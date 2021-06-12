<script lang="ts">
	import { client, gql } from '$lib/graphql'

  type Column = {
    label: string;
    fields: string[];
    href?: (object) => string;
    format?: (object) => string;
  }
  let columns : Column[] = [
    { label: 'Name', fields: ['name'], href: ({ name }) => `m/${name.toLowerCase()}`},
    { label: 'Email', fields: ['email'] },
    { label: 'Phone', fields: ['phone'] },
    {
      label: 'Address',
      fields: ['address', 'city'],
      format: ({ address, city }) => `${address ?? ''} ${city ?? ''}`.trim()
    },
    {
      label: 'Full name',
      fields:['firstname', 'lastname'],
      format: ({ firstname, lastname }) => `${firstname??''} ${lastname??''}`.trim() },
    {
      label: 'Roles',
      fields: ['roles(where:{valid_till:{_is_null:true}, valid_from:{_lte:"NOW()"}}) { role }'],
      format: ({ roles }) => roles.map(({ role }) => role)
    }
  ]
</script>

<table>
  <thead>
    {#each columns as { label }}
      <th>{label}</th>
    {/each}
  </thead>
  <tbody>
    {#await client.request(gql`
      {
        people: auth_person (order_by:{id:asc}) {
          ${columns.flatMap(({ fields }) => fields).join(' ')}
        }
      }
    `)}
      <tr class="ssc-line"></tr>
    {:then { people }} 
      {#each people as person}
        <tr>
          {#each columns as { fields, href, format }}
          <td>
            {#if href}
              <a href={href(person)}>
                {format ? format(person)
                        : person[fields[0]] ?? ''}
              </a>
            {:else}
              {format ? format(person)
                      : person[fields[0]] ?? ''}
            {/if}
          </td>
          {/each}
        </tr>
      {:else}
        <tr>
          <td colspan=3>There are no people. <a href='create'>Create a new one.</a></td>
        </tr>
      {/each}
    {/await}
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th {
    background-color: var(--tertiary-color);
    position: sticky;
    top: 0;
    font-weight: bold;
    border-bottom: 1px solid var(--accent-color);
    text-align: left;
  }
  th, td {
    line-height: 1.4;
    padding-right: .5rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  th:first-child, td:first-child {
    padding-left: 1rem;
  }
  tr {
    background-color: var(--pure-white);
    border-bottom: 1px solid var(--primary-color);
  }
  tr:hover {
    background-color: var(--secondary-color);
  }
</style>