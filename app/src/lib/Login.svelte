<script lang="ts">
  import { goto } from '$app/navigation';
  import { session } from '$app/stores';
  import { enhance } from '$lib/Form'
  let error
</script>

<form
  action="/auth/login"
  method="post"
  use:enhance={{
    pending: () => {
      error = null
    },
    result: async (res, form) => {
      $session = {
        ...$session,
        user: await res.json()
      }
      form.reset();
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