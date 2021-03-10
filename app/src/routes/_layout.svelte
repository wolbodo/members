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

<style>
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Ubuntu:wght@300&display=swap');

  :global(:root) {
    --primary-color: #ff0088;
    --primary-color: #ff0088;
    --highlight-color: rgb(187, 187, 187);
    --foreground-color: black;
    --background-color: white;
  }

  @media (prefers-color-scheme: dark) {
    :global(:root) {
      --primary-color: #ff0088;
      --highlight-color: rgb(51, 51, 51);
      --foreground-color: white;
      --background-color: black;
    }
  }

  :global(html) {
    font-family: 'Ubuntu', sans-serif;
    font-size: 1em;
    box-sizing: border-box;
    height: 100%;
    background: var(--background-color);
    color: var(--foreground-color);
  }

  :global(body) {
    height: 100%;
    margin: 0;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    max-width: 1000px;
    margin: auto;
  }
</style>
