<script lang="ts">
	import { user, client, gql } from '$lib/graphql'
</script>

<section class='actions'>

  {#if $user.roles.includes('board')}
    <a href='create'>Create</a>
  {/if}
</section>

<table>
  <thead>
    <td>
      Name
    </td>
    <td>
      Email
    </td>
    <td>
      Phone
    </td>
  </thead>
  <tbody>
    {#await client.request(gql`
      {
        people: auth_person{
          name email phone
        }
      }
    `)}
      <tr class="ssc-line"></tr>
    {:then { people }} 
      {#each people as { name, email, phone}}
        <tr>
          <td>{name}</td>
          <td>{email}</td>
          <td>{phone}</td>
        </tr>
      {:else}
        <tr>
          <td colspan=3>There are no people. <a href='create'>Create a new one.</a></td>
        </tr>
      {/each}
    {/await}
  </tbody>
</table>

