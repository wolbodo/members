<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	export const filterFields = (search: RegExp, ...fields: (string | undefined)[]) =>
		fields.some((field) => field && field.match(search));
	export const searchValue = writable(new RegExp('', 'i'));
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import logo from './logo.svg';
	import type { PageData } from '../../routes/$types';

	export let user: PageData['user'];

	const focus = (node: HTMLElement) => node.focus();

	let searchOpen = false;
	let _searchValue = '';

	$: {
		$searchValue = new RegExp(_searchValue, 'i');
	}

	function scale(node: HTMLElement, { delay = 0, duration = 400 }) {
		const o = parseFloat(getComputedStyle(node).width);
		return {
			delay,
			duration,
			css: (t: number) => `width: ${t * o}px`
		};
	}
	const closeSearch = () => {
		console.log('close');
		searchOpen = !searchOpen;
		_searchValue = '';
	};
</script>

<header>
	<nav>
		<section class="home">
			<a href="/">
				<img src={logo} alt="SvelteKit" />
				<h1>Members</h1>
			</a>
		</section>

		{#if user}
			<section class="search" class:searchOpen>
				{#if searchOpen}
					<input
						transition:scale
						bind:value={_searchValue}
						use:focus
						placeholder="Search"
						on:keydown={(e) => {
							if (e.code == 'Escape') {
								closeSearch();
							} else if (e.code == 'Enter') {
								console.log('Should goto user or trigger search or whatever', $page);
							}
						}}
					/>
				{/if}
				<button
					type="button"
					class="icon"
					on:click={() => {
						if (searchOpen) {
							closeSearch();
						} else {
							searchOpen = true;
						}
					}}
				>
					{searchOpen ? 'close' : 'search'}
				</button>
			</section>

			<ul>
				<li class:active={$page.url.pathname === '/'}><a href="/">Members</a></li>

				{#if user.roles.includes('board')}
					<li class:active={$page.url.pathname === '/mail'}>
						<a href="/mail">Mail</a>
					</li>
					<li class:active={$page.url.pathname === '/changes'}>
						<a href="/changes">Changes</a>
					</li>
				{/if}

				<li class:active={$page.url.pathname === `/m/${user.name}`}>
					<a href="/m/{user.name}">{user.name}</a>
				</li>

				<li class:active={$page.url.pathname === '/logout'}>
					<a href="/auth/logout">Logout</a>
				</li>
			</ul>
		{/if}
	</nav>
</header>

<style>
	header {
		display: flex;
		align-self: stretch;
		justify-content: center;
		margin-bottom: 0.5rem;
		background: var(--primary-3);
	}

	nav {
		width: 50rem;
		max-width: 100%;
		display: flex;
		--background: rgba(255, 255, 255, 0.7);
	}

	nav a,
	nav li button {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 1.8px;
		text-decoration: none;
		transition: color 0.2s linear;
	}
	nav li button {
		margin: 0;
		background: none;
	}

	.search {
		position: relative;
		min-width: 3rem;
	}
	.search button {
		margin: 0;
		font-size: 1.5rem;
		line-height: 1.5rem;
		padding: 0 0.7rem;
		height: 100%;
		border-radius: 0;
		background: var(--primary-4);
		position: absolute;
		right: 0;
		top: 0;
	}
	.search button:focus {
		box-shadow: none;
		outline: 4px solid var(--primary-4);
		outline-offset: -4px;
		background: var(--primary-5);
		color: var(--heading-color);
	}
	.search.searchOpen button {
		background: none;
		color: var(--primary-1);
	}

	.search input {
		height: 3rem;
		min-width: 3rem;
		margin: 0;
		border-radius: 0;
		box-shadow: none;
	}

	nav section {
		height: 3rem;
	}

	nav .home {
		flex-grow: 1;
		display: flex;
	}

	nav .home h1 {
		margin: 0 0.5rem;
		text-transform: none;
		color: white;
		font-size: 1.5rem;
	}

	nav a {
		display: flex;
		align-items: center;
		height: 100%;
	}
	nav a:focus {
		outline: 4px solid var(--primary-4);
		outline-offset: -4px;
	}
	nav a:hover {
		color: var(--primary-1);
	}

	nav img {
		width: 2em;
		height: 2em;
		object-fit: contain;
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
		border-top: var(--size) solid var(--primary-2);
	}
</style>
