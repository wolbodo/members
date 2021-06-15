<script lang="ts">
  import Table from '$lib/Table.svelte'
  import { searchValue, filterFields } from '$lib/Header/index.svelte'
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

  const getData = async () => {
    return client.request(gql`
      {
        people: auth_person (order_by:{id:asc}) {
          ${columns.flatMap(({ fields }) => fields).join(' ')}
        }
      }
    `)
  }
</script>

<Table>
  <thead>
    <tr>
      {#each columns as { label }}
        <th>{label}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#await getData()}
      <tr class="ssc-line"></tr>
    {:then { people }} 
      {#each people.filter(person => filterFields($searchValue, person.name, person.firstname, person.lastname)) as person}
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
</Table>
