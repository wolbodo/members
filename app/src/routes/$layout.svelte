
<style>
  :global(:root) {
    --main-color: #ff0088;
    --text-color: black;
    --color-white: white;
  }

  :global(html) {
    font-family: system-ui;
    font-size: 1em;
    box-sizing: border-box;
    height: 100%;
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

<main>
  <slot />
</main>