<script>
  import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
  import { setClient } from "svelte-apollo";
  import fetch from "cross-fetch";

  setClient(
    new ApolloClient({
      link: new HttpLink({ uri: "http://graphql.wolbodo/graphql", fetch }),
      cache: new InMemoryCache(),
    })
  );
</script>

<main>
  <slot />
</main>

<style>
  @media (prefers-color-scheme: dark) {
    :global(:root) {
      --primary-color: #ff0088;
      --foreground-color: white;
      --background-color: black;
    }
  }

  @media (prefers-color-scheme: light) {
    :global(:root) {
      --primary-color: #ff0088;
      --foreground-color: black;
      --background-color: white;
    }
  }

  :global(html) {
    font-family: system-ui;
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
