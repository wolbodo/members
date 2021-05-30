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

<section>
  <label class:changed for={name}>{label}</label>
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

  label.changed {
    color: var(--accent-color);
  }
</style>