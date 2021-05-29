<div>
  <span>Name</span>
  <span>Email</span>
  <span class="desktop-only">Phone</span>
</div>

<style>
  div {
    font-family: 'Truculenta', 'Ubuntu', sans-serif;
    font-weight: bold;
    text-transform: uppercase;
    color: var(--foreground);
    display: grid;
    grid-template-columns: 1fr 17rem 9rem;
    gap: 1rem;
    padding: 0.3rem 0 0.2rem 0;
    border-bottom: solid 1px var(--primary);
  }

  @media screen and (max-width: 560px) {
    div {
      grid-template-columns: 8rem 1fr;
    }

    .desktop-only {
      display: none;
    }
  }
</style>
