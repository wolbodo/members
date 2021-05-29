<script lang="ts">
  export let name: string
  export let label: string
  export let type: string = 'text'
  export let placeholder: string | null = null


  let changed = false
</script>

<label class:changed for={name}>{label}</label>
<input class:changed
  {name}
  {placeholder}
  {type}
  id={name}
  on:change={() => changed = true }
/>

<style>
  label.changed {
    color: var(--accent-color);
  }
</style>