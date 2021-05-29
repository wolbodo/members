<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang='ts'>
	import { client, user } from '$lib/graphql'
	import List from '$lib/List.svelte'
	import { gql } from 'graphql-request'
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>
		Wolbodo Members list
	</h1>

	{#if $user}
		{#await client.request(gql`
			{
				people: auth_person{
					name email
				}
			}
		`)}
			<p>Loading</p>
		{:then data} 
			<List people={data.people} />
		{/await}
	{:else}
		<h2>
			try logging in <a href='/login'>here</a>
		</h2>
	
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
