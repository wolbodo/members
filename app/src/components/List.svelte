<script>
  export let members = [];
</script>

<style>
  .list {
    overflow: auto;
    width: 100%;
    margin: 1rem 0rem;
    max-height: 80vh;
  }

  .list-item {
    display: grid;
    gap: 1rem;
    grid-template-columns: 8rem 1fr;
    padding: 0.5rem 1rem;
    border-bottom: solid 1px grey;
  }

  @media (min-width: 560px) {
    .list {
      overflow-y: auto;
      margin: 1rem 2rem;
      max-height: 100%;
    }
    .list-item {
      grid-template-columns: 1fr 17rem 9rem;
    }
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
    text-decoration: none;
  }
  a:focus {
    outline: dashed 0.25rem var(--main-color);
    outline-offset: 0.125rem;
  }

  @media all and (max-width: 560px) {
    .mobile-only {
      display: none;
    }
  }
</style>

<div class="list">
  <div class="list-item header">
    <strong>name</strong>
    <strong>email</strong>
    <strong class="mobile-only">phone</strong>
  </div>
  {#each members as { id, name, email, phone }}
    <div class="list-item">
      <a href="/members/{name.toLowerCase()}">{name}</a>
      <a href="mailto:{email}" target="_blank" title="Send email to {email}">{email}</a>
      <a href="tel:{phone}" class="mobile-only" title="Call {phone}">{phone}</a>
    </div>
  {:else}
    <h3>No members found...</h3>
  {/each}
</div>
