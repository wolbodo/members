<script>
  import { PUBLIC_URL } from '$lib/config'
  export let person
  export let data

  $: resetLink = `${PUBLIC_URL}/auth/reset?token=${data.token}`
</script>

<svelte:head>Reset your password</svelte:head>

<h1>Hi {person.name},</h1>

<p>You, or someone else has requested a password reset.</p>
<p>Please follow <a href={resetLink}>this link</a> to proceed.</p>

<p>This link will be valid for 30 minutes</p>

