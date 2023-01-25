<script lang="ts">
	import type { PageData } from './$houdini'

	import List from '$lib/List.svelte';

    /* @type { import('./$houdini').PageData } */
    export let data: PageData
    
    $: ({ AllPeople } = data)
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<List
	people={$AllPeople.data?.people}
	fetching={$AllPeople.fetching}
/>
	<!-- where={{
		roles: {
			_or: [{ valid_till: { _gte: 'NOW()' } }, { valid_till: { _is_null: true } }],
			valid_from: { _lte: 'NOW()' },
			role: { _eq: 'member' }
		}
	}} -->

<style>
	h1 {
		width: 100%;
	}
</style>
