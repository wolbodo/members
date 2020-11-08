<script>

</script>

<style>
  button {
    padding: var(--button-padding);
    background: var(--main-color);
    color: var(--color-white);
    font-weight: bolder;
    border: none;
  }
</style>

<button on:click>
  <slot>Click</slot>
</button>