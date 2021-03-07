<script>
  import { query } from "svelte-apollo";

  import Button from "$components/Button.svelte";
  import List from "$components/List.svelte";

  import gql from "graphql-tag";

  const allMembers = query(gql`
    query People {
      people {
        edges {
          node {
            id
            name
            email
            phone
          }
        }
      }
    }
  `);

  async function getMembers() {
    const res = await fetch(`members.json`);
    const json = await res.json();

    if (res.ok) {
      return json;
    } else {
      throw new Error(json);
    }
  }
  let promise = getMembers().catch((err) => console.log(err));
</script>

{#if $allMembers.loading}
  <h1>...waiting on members</h1>
{:else if $allMembers.error}
  <p style="color: red">{$allMembers.error}</p>
{:else}
  <List members={$allMembers.data.people.edges} />
{/if}
<div>
  <Button>Add member</Button>
</div>
