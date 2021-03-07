<script>
  import { derived } from "svelte/store";
  import { stores } from "@sapper/app";
  import gql from "graphql-tag";
  import Button from "../../components/Button.svelte";
  import { query } from "svelte-apollo";

  const { page } = stores();

  const getMember = query(
    gql`
      query People($name: String) {
        people(filter: { name: { likeInsensitive: $name } }) {
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

<Button href="/">Back</Button>

{#if $getMember.loading}
  <h1>...waiting on member</h1>
{:else if $getMember.error}
  <p style="color: red">{$getMember.error}</p>
{:else}
  <h1>{$member.name}</h1>
  <pre>{JSON.stringify($member, null, 2)}</pre>
{/if}
