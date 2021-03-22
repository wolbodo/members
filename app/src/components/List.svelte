<script>
  import ListHeader from './ListHeader.svelte';
  import ListItem from './ListItem.svelte';
  export let members = [];
</script>

<div class="list">
  <ListHeader />
  {#each members as { node: { name, email, phone } }}
    <ListItem {name} {email} {phone} />
  {:else}
    <h3>No members found...</h3>
  {/each}
</div>

<style>
  .list {
    overflow: auto;
    margin: 1rem 0;
    max-height: 80vh;
  }

  @media (min-width: 560px) {
    .list {
      overflow: visible;
      max-height: 100%;
    }
  }

  h3 {
    margin: auto;
    padding: 0.5rem 1rem;
    width: fit-content;
  }
</style>
