<script>
  import Counter from '$components/Counter.svelte';
</script>

<style>
  :global(:root) {
    --button-padding: 0.25rem 0.5rem;
    --main-color: #d63b8e;
    --text-color: black;
    --color-white: white;
  }

  :global(html) {
    font-family: system-ui;
    font-size: 1em;
  }
</style>

<main>
  <Counter />
  <p>
    Visit the
    <a href="https://svelte.dev">svelte.dev</a>
    to learn how to build Svelte apps.
  </p>
</main>
