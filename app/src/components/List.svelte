<script>
  export let members = [];
</script>

<div class="list">
  <div class="list-item header">
    <strong>name</strong>
    <strong>email</strong>
    <strong class="desktop-only">phone</strong>
  </div>
  {#each members as { id, name, email, phone }}
    <div class="list-item">
      <a href="/members/{name.toLowerCase()}">{name}</a>
      <a
        href="mailto:{email}"
        target="_blank"
        title="Send email to {email}"
        tabindex="-1">{email}</a
      >
      <a
        href="tel:{phone}"
        class="desktop-only"
        title="Call {phone}"
        tabindex="-1"
        >{phone}
      </a>
    </div>
  {:else}
    <h3>No members found...</h3>
  {/each}
</div>

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
    border-bottom: solid 1px grey;
  }

  .list-item:not(:first-of-type):focus-within,
  .list-item:not(:first-of-type):hover {
    color: var(--background-color);
    background: var(--foreground-color);
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
    color: var(--primary-color);
    text-decoration: none;
  }
  a:focus {
    outline: dashed 0.25rem var(--primary-color);
    outline-offset: 0.125rem;
  }

  @media all and (max-width: 560px) {
    .desktop-only {
      display: none;
    }
  }
</style>
