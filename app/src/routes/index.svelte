<script>
  import Button from '$components/Button.svelte';
</script>

<style>
  :global(:root) {
    --main-color: #ff0088;
    --text-color: black;
    --color-white: white;
  }

  :global(html) {
    font-family: system-ui;
    font-size: 18px;
    box-sizing: border-box;
    height: 100%;
  }
  :global(body) {
    height: 100%;
    margin:0;
  }
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    height:100%;
  }
</style>

<main>
 <Button>Submit</Button>
</main>
