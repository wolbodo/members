<script>
  export let members = [];
</script>

<style>
  .list {
    width: 100%;
    margin: 1rem 2rem;
  }
  .list-item {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 20rem 8rem;
    padding: 0.5rem 1rem;
    border-bottom: solid 1px grey;
  }
  .header {
    text-transform: uppercase;
  }
  h3 {
    margin: auto;
    padding: 0.5rem 1rem;
    width: fit-content;
  }
  a {
    color: var(--main-color);
  }
  a:focus {
    outline: dashed 0.25rem var(--main-color);
    outline-offset: 0.125rem;
  }
</style>

<div class="list">
  <div class="list-item header">
    <strong>name</strong>
    <strong>email</strong>
    <strong>phone</strong>
  </div>
    {#each members as { id, name, email, phone }}
      <div class="list-item">
        <span>{name}</span>
        <a href="mailto: {email}" target="_blank">{email}</a>
        <span>{phone}</span>
      </div>
    {:else}
      <h3>No members found...</h3>
    {/each}
</div>
