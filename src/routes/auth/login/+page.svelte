<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import type { ActionData } from '../$types';

	export let form: ActionData;

	const redirect = $page.url.searchParams.get('redirect');
</script>

<h1>Log in</h1>

<form method="post" use:enhance>
	{#if redirect}
		<p>After logging in you will be redirected to <a href={redirect}>{redirect}</a></p>
		<input type="hidden" name="redirect" value={redirect} />
	{/if}

	<label for="name">Name or email</label>
	<input id="name" name="name" placeholder="Use your nickname" value={form?.name ?? ''} />

	<label for="password">Password</label>
	<input id="password" name="password" type="password" />

	{#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}

	<p><a href="/auth/forgot">Forgot your password?</a></p>

	<button type="submit">Submit</button>
</form>
