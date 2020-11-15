<script>
  import Button from '$components/Button.svelte';
  import List from '$components/List.svelte';
  import { onMount, getContext, setContext, afterUpdate } from 'svelte';
  import { members } from '$components/members';
</script>

<main>
  {#if $members.loading}
    <h1>...waiting on members</h1>
  {:else if $members.error}
    <p style="color: red">{$members.error}</p>
  {:else}
    <List members={$members.data} />
  {/if}
  <div>
    <Button>Add member</Button>
    <Button href="/member/dexter">goto dexter</Button>
  </div>
</main>

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
