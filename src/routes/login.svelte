<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ session }) {
		if (session.user) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		return {};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { session, page } from '$app/stores';
	import { enhance } from '$lib/Form';

	let error;
	const redirect = $page.query.get('redirect');
</script>

<h1>Log in</h1>

{#if redirect}
	<p>After logging in you will be redirected to <a href={redirect}>{redirect}</a></p>
{/if}

<form
	action="/auth/login"
	method="post"
	use:enhance={{
		pending: () => {
			error = null;
		},
		result: async (res, form) => {
			goto(redirect ? redirect : '/');
			$session = {
				...$session,
				user: await res.json()
			};
		},
		error: async (res) => {
			error = await res.text();
		}
	}}
>
	<label for="name">Name</label>
	<input id="name" name="name" placeholder="Use your nickname" />

	<label for="password">Password</label>
	<input id="password" name="password" type="password" />

	{#if error}
		<small>{error}</small>
	{/if}

	<p><a href="/auth/forgot">Reset your password</a></p>

	<button type="submit">Submit</button>
</form>
