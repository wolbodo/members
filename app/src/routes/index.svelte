<script>
  import { query } from "svelte-apollo";

  import Button from "../components/KarelButton.svelte";
  import List from "../components/List.svelte";

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
