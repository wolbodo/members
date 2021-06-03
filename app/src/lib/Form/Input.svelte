<script lang="ts">
  export let name: string
  export let label: string
  export let type: string | SvelteComponent = 'text'
  export let value: any

  let changed = false
  $: if (value) {
    changed = false
  }
</script>

<section class:changed>
  <label for={name}>{label}</label>
  {#if type === 'textarea' }
    <textarea
      {...$$props}
      id={name}
      on:change={() => changed = true }
  />
  {:else if typeof type === 'string'}
    <input class:changed
      {...$$props}
      id={name}
      on:change={() => changed = true }
    />
  {:else}
    <svelte:component this={type} id={name} {...$$props} />
  {/if}
</section>

<style>

  input {
    background: var(--tertiary-color);
    border-color: rgba(255,255,255,0.1);
  }

  input.wide {
    width: 100%;
  }


  input:focus, section:hover input, .changed input {
    background: var(--pure-white);
  }

  input:read-only, input:read-only:hover, section:hover input:read-only {
    background: initial;
    padding:initial;
  }

  .changed label {
    color: var(--accent-color);
  }
</style>