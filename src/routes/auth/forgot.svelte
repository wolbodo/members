<script lang="ts">
  import { enhance } from '$lib/Form'
  let error
  let done
</script>

<h1>Forgot your password?</h1>

<p>We'll send a password reset link to your email to get you going.</p>

<form
  action="/auth/forgot"
  method="post"
  use:enhance={{
    pending: () => {
      error = null
    },
    result: async (res, form) => {
      console.log("Got response", res)
      done = true
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

  {#if done}
    <small>If the address exists in our database, you'll shortly have an email</small>
  {/if}

  <button type='submit'>Submit</button>
</form>