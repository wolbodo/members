<script lang="ts">
  export let people
</script>

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
    <pre>{JSON.stringify(people, null, 2)}</pre>

  </tbody>
</table>