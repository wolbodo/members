
<table>
  <slot />
</table>

<style>
  table {
    border-collapse: collapse;
    width: 100%;
  }
  table :global(th) {
    background-color: var(--tertiary-color);
    position: sticky;
    top: 0;
    font-weight: bold;
    border-bottom: 1px solid var(--accent-color);
    text-align: left;
  }
  table :global(th), table :global(td) {
    line-height: 1.4;
    padding-right: .5rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  table :global(th:first-child), table :global(td:first-child) {
    padding-left: 1rem;
  }
  table :global(tr) {
    background-color: var(--pure-white);
    border-bottom: 1px solid var(--primary-color);
  }

  table :global(tr:hover) {
    background-color: var(--secondary-color);
  }
  table :global(tr.highlight) {
    background-color: var(--quaternary-color);
  }
</style>