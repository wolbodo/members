<script context='module'>
	import { token } from '$lib/graphql'

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, session }) {
		if (session.user) {
			token.set(session.user.token)
		} else if ('/' !== page.path) {
			return {
				status: 302,
				redirect: '/'
			}
		}

		return {}
	}
</script>

<script lang="ts">
  import { session } from '$app/stores';

	import Header from '$lib/Header/index.svelte';
	import '../app.css';

	$: if ($session.user) {
		$token = $session.user.token
	}
</script>

<main>
	<Header />

	<slot />
</main>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin: 1rem;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
