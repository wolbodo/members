<script>
  import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
  import { setClient } from "svelte-apollo";
  import fetch from "cross-fetch";
  import { setContext } from "svelte";

  setClient(
    new ApolloClient({
      link: new HttpLink({ uri: "/graphql", fetch }),
      cache: new InMemoryCache({
        dataIdFromObject: (result) => {
          if (result.id && result.__typename) {
            return result.__typename + result.id;
          }

          // Make sure to return null if this object doesn't have an ID
          return null;
        },
      }),
    })
  );
</script>

<main>
  <slot />
</main>
