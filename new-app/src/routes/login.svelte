<script lang="ts">
  import { enhance } from '$lib/form'
</script>

<form
  action="/login"
  method="post"
  use:enhance={{
    result: async (res, form) => {
      const created = await res.json();
      todos = [...todos, created];

      form.reset();
    }
  }}
>
  <label for='name'>Name</label>
  <input id='name' name='name' placeholder="Use your nickname" />

  <label for='password'>Password</label>
  <input id='password' name='password' type='password' />

  <button type='submit'>Submit</button>
</form>