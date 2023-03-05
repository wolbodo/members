<script lang="ts">
	import type { PageData } from './$houdini';
	import List from '$lib/List.svelte';

	export let data: PageData;
	export let user: PageData['user'];

	$: ({ AllPeople, user } = data);
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

{#if user.roles.includes('board')}
	<section>
		<a class="button" href="/m/new">Create</a>
	</section>
{/if}

<List people={$AllPeople.data?.people} fetching={$AllPeople.fetching} />

<!-- where={{
		roles: {
			_or: [{ valid_till: { _gte: 'NOW()' } }, { valid_till: { _is_null: true } }],
			valid_from: { _lte: 'NOW()' },
			role: { _eq: 'member' }
		}
	}} -->
<style>
	section a {
		display: inline-block;
		margin: 1rem 0;
	}
</style>
