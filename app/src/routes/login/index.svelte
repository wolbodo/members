<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$lib/Form'
  import { user } from '$lib/graphql'
  let error
</script>

<form
  action="/login"
  method="post"
  use:enhance={{
    pending: () => {
      error = null
    },
    result: async (res, form) => {
      user.set(await res.json())
      form.reset();
      goto('/')
    },
    error: async (res) => {
      error = await res.text()
    }
  }}
>
  <label for='name'>Name</label>
  <input id='name' name='name' placeholder="Use your nickname" />

  <label for='password'>Password</label>
  <input id='password' name='password' type='password' />

  {#if error}
    <small>{error}</small>
  {/if}

  <button type='submit'>Submit</button>
</form>