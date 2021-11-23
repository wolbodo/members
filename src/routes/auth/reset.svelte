<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  import { enhance } from '$lib/Form'
  let error
</script>

<h1>Set your new password</h1>

<form
  action="/auth/reset"
  method="post"
  use:enhance={{
    pending: () => {
      error = null
    },
    result: async (res, form) => {
      console.log("Got response", res)
      form.reset();
      goto('/')
    },
    error: async (res) => {
      error = await res.text()
    }
  }}
>
  <label for='password'>Password</label>
  <input id='password' name='password' type='password' />
  <input type='hidden' name='token' value={$page.query.get('token')} />

  {#if error}
    <small>{error}</small>
  {/if}

  <button type='submit'>Submit</button>
</form>