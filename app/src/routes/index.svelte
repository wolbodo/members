<script lang='ts'>
  import { session } from '$app/stores';
	import List from '$lib/List.svelte'
	import Login from '$lib/Login.svelte'

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	{#if $session.user}
		<List />
	{:else}
		<Login />
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
