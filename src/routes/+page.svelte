<script lang="ts">
	// import List from '$lib/List.svelte';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<h1>HI</h1>

<!-- <List
	where={{
		roles: {
			_or: [{ valid_till: { _gte: 'NOW()' } }, { valid_till: { _is_null: true } }],
			valid_from: { _lte: 'NOW()' },
			role: { _eq: 'member' }
		}
	}}
/> -->

<style>
	h1 {
		width: 100%;
	}
</style>
