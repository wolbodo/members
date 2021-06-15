<script lang="ts">
  import { session } from '$app/stores';
  import { enhance } from '$lib/Form'
  let error
</script>

<h1>Forgot your password?</h1>

<p>We'll send a password reset link to your email to get you going.</p>

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
  <label for='email'>Email</label>
  <input id='email' name='email' type='email' />

  {#if error}
    <small>{error}</small>
  {/if}

  <button type='submit'>Submit</button>
</form>