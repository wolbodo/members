<script lang="ts">
  export let name: string
  export let label: string


  let changed = false
</script>

<section>
  <label class:changed for={name}>{label}</label>
  <input class:changed
  {...$$props}
  id={name}
  on:change={() => changed = true }
  />
</section>

<style>

  label.changed {
    color: var(--accent-color);
  }
</style>