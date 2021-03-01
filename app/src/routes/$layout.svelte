<script lang="ts">
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    const root: HTMLElement = document.querySelector(':root');
    root.style.setProperty('--foreground-color', 'white');
    root.style.setProperty('--background-color', 'black');
  }
</script>

<main>
  <slot />
</main>

<style>
  :global(:root) {
    --primary-color: #ff0088;
    --foreground-color: black;
    --background-color: white;
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
