<script context="module">
	import env from '../environment';
	import { setEnvironment } from '$houdini';

	setEnvironment(env);

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, session }) {
		if (
			!session.user &&
			!['/login', '/logout', '/auth/forgot', '/auth/reset'].includes(page.path)
		) {
			return {
				status: 302,
				redirect: '/login'
			};
		}

		return {};
	}
</script>

<script lang="ts">
	import Header from '$lib/Header/index.svelte';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<style>
	main {
		padding: 1rem;
		box-sizing: border-box;
		margin: 0 auto;
	}
</style>
