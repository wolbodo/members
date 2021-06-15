<script context="module">
	import { writable } from 'svelte/store'

	export const searchValue = writable('')
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { session, page } from '$app/stores';
	import logo from './logo.svg';

	async function logout() {
		$session.user = null
		await fetch('/auth/logout', { method: 'post'})
		goto('/')
	}

	const focus = node => node.focus()
</script>

<header>
	<div class="corner">
		<a href="/">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	{#if $session.user}
		<div class='search'>
			<input bind:value={$searchValue} use:focus placeholder="Search" />
		</div>

		<nav>
			<ul>
				<li class:active={$page.path === '/'}><a sveltekit:prefetch href="/">Members</a></li>
					{#if $session.user.roles.includes('board')}
						<li class:active={$page.path === '/create'}><a sveltekit:prefetch href="/create">Create</a></li>
						<li class:active={$page.path === '/mail'}><a sveltekit:prefetch href="/mail">Mail</a></li>
					{/if}
				<li><button on:click={logout}>Logout</button></li>
			</ul>
		</nav>
	{/if}
		
		<div class="corner">
			<!-- TODO put something else here? github link? -->
		</div>
</header>

<style>
	header {
		display: flex;
		margin-bottom: 0.5rem;
	}

	input {
		height: 3rem;
		margin: 0;
		border-radius: 0;
		box-shadow: none;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	button:hover:not(:disabled) {
    background-color: initial;
}
	button {
    background-color: initial;
    border: initial;
    outline: initial;
    border-radius: initial;
		letter-spacing: initial;
    margin-top: initial;
    line-height: initial;
    min-width: initial;
    cursor: pointer;
	}

	nav a, nav button {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 10%;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover, button:hover {
		color: var(--accent-color);
	}
</style>
