<script lang='ts'>
  import { DateTime, Settings } from 'luxon'
  Settings.defaultLocale = 'nl'

  export let name
  export let value = []
  export let options = []


  let newValue = ''
  $: used = value ? value.filter(({ valid_till }) => !valid_till).map(({ role }) => role) : []

</script>

<section>
  <input type='text' bind:value={newValue} placeholder='type to add a role'/>
  
  {#if newValue}
    <ul class='options'>
      {#each options.filter(opt => !used.includes(opt) && opt.match(newValue)) as option}
        <li>{option}</li>
      {/each}
    </ul>
  {/if}
</section>

{#if value}
  <ul class='roles'>
    {#each value as { role, valid_from, valid_till }}
      <li>
        <span>{role}</span>
        <span>{DateTime.fromISO(valid_from).toLocaleString()}</span>

        {#if valid_till}
          {DateTime.fromISO(valid_till).toLocaleString()}
        {:else}
          <button>Stop</button>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  .options {
    margin: 0;
    padding: 0.5rem;
    list-style: none;
    background: white;
  }

  .roles {
    padding: 0;
  }
  .roles li {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
  }
</style>