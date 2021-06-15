<script lang="ts">
  import { session } from '$app/stores';
  import { enhance } from '$lib/Form'
  let error
</script>

<h1>Log in</h1>

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

  <a href='/auth/forgot'>Reset your password</a>

  <button type='submit'>Submit</button>
</form>