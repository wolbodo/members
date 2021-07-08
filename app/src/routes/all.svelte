<script lang='ts'>
  import { session } from '$app/stores';
	import List from '$lib/Person/List.svelte'
</script>

<svelte:head>
	<title>All members</title>
</svelte:head>

<section>
	{#if $session.user}
		<List />
	{/if}
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
