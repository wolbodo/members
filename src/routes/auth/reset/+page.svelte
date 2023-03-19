<script lang="ts">
	import { page } from '$app/stores';

	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1>Set your new password</h1>

<form method="post">
	<label for="password">Password</label>
	<input id="password" name="password" type="password" />
	<input type="hidden" name="token" value={$page.url.searchParams.get('token')} />

	{#if form?.error}
		<small>{form.error}</small>
	{/if}

	<button type="submit">Submit</button>
</form>
