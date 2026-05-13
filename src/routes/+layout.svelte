<script lang="ts">
	import Header from '$lib/Header/index.svelte';
	import '../app.css';
	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';

	interface Props {
		data: LayoutServerData;
		children?: Snippet;
	}

	let { data, children }: Props = $props();
</script>

<Header user={data.user} />

<main>
	{@render children?.()}
</main>

<style>
	main {
		padding: 1rem;
		box-sizing: border-box;
		margin: 0 auto;
	}
</style>
