<script>
  import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
  import { setClient } from "svelte-apollo";
  import fetch from "cross-fetch";
  import { query } from "svelte-apollo";
  import gql from "graphql-tag";
  import List from "../components/List.svelte";
  import NavLink from '../components/NavLink.svelte';

  setClient(
    new ApolloClient({
      link: new HttpLink({ uri: "http://localhost:5001/graphql", fetch }),
      cache: new InMemoryCache(),
    })
  );

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
  <NavLink>Add member</NavLink>
</div>
