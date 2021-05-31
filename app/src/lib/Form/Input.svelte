<script lang="ts">
  export let name: string
  export let label: string
  export let type: string
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
  {:else}
    <input class:changed
      {...$$props}
      id={name}
      on:change={() => changed = true }
    />
  {/if}
</section>

<style>

  input {
    background: var(--tertiary-color);
    border-color: rgba(255,255,255,0.1);
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