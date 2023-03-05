<script lang="ts">
	import type { PageData } from './$houdini';
	import List from '$lib/List.svelte';
	import Toggle from '$lib/Toggle.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let data: PageData;
	export let user: PageData['user'];

	$: showAllPeople = $page.url.searchParams.has('all');
	$: ({ AllPeople, user } = data);
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	{#if user.roles.includes('board')}
		<a class="button" href="/m/new">Create</a>
	{/if}

	<Toggle
		checked={showAllPeople}
		on:change={(e) => {
			if (e.target && e.target instanceof HTMLInputElement)
				goto(`?${e.target.checked ? 'all' : ''}`);
		}}>{showAllPeople ? 'Show only members' : 'Show all people'}</Toggle
	>
</section>
<List people={$AllPeople.data?.people} fetching={$AllPeople.fetching} />

<style>
	section a {
		display: inline-block;
		margin: 1rem 0;
	}
</style>
