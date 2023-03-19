<script lang="ts">
	import type { ActionData } from '../$types';

	export let form: ActionData;

	import { page } from '$app/stores';

	const redirect = $page.url.searchParams.get('redirect');
</script>

<h1>Log in</h1>

{#if redirect}
	<p>After logging in you will be redirected to <a href={redirect}>{redirect}</a></p>
{/if}

<form method="post" action="/auth?/login">
	<label for="name">Name or email</label>
	<input id="name" name="name" placeholder="Use your nickname" value={form?.name ?? ''} />

	<label for="password">Password</label>
	<input id="password" name="password" type="password" />

	{#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}

	<p><a href="/auth/forgot">Forgot your password?</a></p>

	<button type="submit">Submit</button>
</form>
