<script>
  import { derived } from "svelte/store";
  import { stores } from "@sapper/app";
  import gql from "graphql-tag";

  import { query } from "svelte-apollo";

  import MemberView from "src/components/MemberView.svelte";

  const { page } = stores();

  const getMember = query(
    gql`
      query People($name: String) {
        people(filter: { name: { likeInsensitive: $name } }) {
          edges {
            node {
              id
            }
          }
        }
      }
    `,
    {
      variables: {
        name: $page.params.iname,
      },
    }
  );

  const member = derived(
    getMember,
    ({
      loading,
      error,
      data: {
        people: {
          edges: [{ node }],
        },
      } = { people: { edges: [{ node: null }] } },
    }) => !loading && !error && node
  );
</script>

{#if $getMember.loading}
  <h1>...waiting on member</h1>
{:else if $getMember.error}
  <p style="color: red">{$getMember.error}</p>
{:else}
  <MemberView id={$member.id} />
{/if}
