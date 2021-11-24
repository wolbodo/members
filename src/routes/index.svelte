<script lang="ts">
	import List from '$lib/Person/List.svelte';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<List
		where={{
			roles: {
				_or: [{ valid_till: { _gte: 'NOW()' } }, { valid_till: { _is_null: true } }],
				valid_from: { _lte: 'NOW()' },
				role: { _eq: 'member' }
			}
		}}
	/>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}
</style>
