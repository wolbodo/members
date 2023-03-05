<script lang="ts">
	import Header from '$lib/Header/index.svelte';
	import '../app.css';

	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ user } = data);
</script>

<Header {user} />

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
