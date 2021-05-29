<script>
  export let name = "";
  export let email = "";
  export let phone = "";
</script>

<div>
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

<style>
  div {
    display: grid;
    grid-template-columns: 1fr 17rem 9rem;
    gap: 1rem;
    padding: 0.3rem 0 0.2rem 0;
    border-bottom: solid 1px var(--primary-dark);
  }

  div:hover {
    background: var(--primary);
  }

  div:hover a {
    color: var(--foreground);
  }

  div:focus-within {
    outline: dashed 0.25rem var(--primary);
    outline-offset: 0.125rem;
  }

  a {
    color: var(--primary);
    text-decoration: none;
  }

  a:focus {
    outline: none;
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
