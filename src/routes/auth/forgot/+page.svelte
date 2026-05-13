<script lang="ts">
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<h1>Forgot your password?</h1>

<p>We'll send a password reset link to your email to get you going.</p>

{#if form?.success}
	<small>If the address exists in our database, you'll shortly have an email</small>
{:else}
	<form method="post">
		<label for="email">Email</label>
		<input id="email" name="email" type="email" />

		{#if form?.error}
			<small>{form.error}</small>
		{/if}

		<button type="submit">Submit</button>
	</form>
{/if}
