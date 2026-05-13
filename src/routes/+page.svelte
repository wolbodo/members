<script lang="ts">
	import List from '$lib/List.svelte';
	import Toggle from '$lib/Toggle.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

	const showAllPeople = $derived($page.url.searchParams.has('all'));
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	{#if data.user?.roles.includes('board')}
		<a class="button" href="/m/+new">Create</a>
	{/if}

	<Toggle
		checked={showAllPeople}
		onchange={(e) => {
			if (e.target instanceof HTMLInputElement)
				goto(`?${e.target.checked ? 'all' : ''}`);
		}}
	>
		{showAllPeople ? 'Show only members' : 'Show all people'}
	</Toggle>
</section>

<List people={data.people} fetching={false} />

<style>
	section a {
		display: inline-block;
		margin: 1rem 0;
	}
</style>
