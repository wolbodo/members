<script context="module">
	import { writable } from 'svelte/store';

	export const filterFields = (search, ...fields) =>
		fields.some((field) => field && field.match(search));
	export const searchValue = writable(new RegExp('', 'i'));
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { session, page } from '$app/stores';
	import logo from './logo.svg';

	const focus = (node) => node.focus();
	let _searchValue = '';

	$: {
		$searchValue = new RegExp(_searchValue, 'i');
	}
</script>

<header>
	<nav>
		<section class="corner">
			<a href="/">
				<img src={logo} alt="SvelteKit" />
			</a>
		</section>

		{#if $session.user}
			<section class="search">
				<input bind:value={_searchValue} use:focus placeholder="Search" />
			</section>

			<nav>
				<ul>
					<li class:active={$page.path === '/'}><a sveltekit:prefetch href="/">Members</a></li>
					<li class:active={$page.path === '/all'}><a sveltekit:prefetch href="/all">All</a></li>
					{#if $session.user.roles.includes('board')}
						<li class:active={$page.path === '/create'}>
							<a sveltekit:prefetch href="/create">Create</a>
						</li>
						<li class:active={$page.path === '/mail'}>
							<a sveltekit:prefetch href="/mail">Mail</a>
						</li>
						<li class:active={$page.path === '/changes'}>
							<a sveltekit:prefetch href="/changes">Changes</a>
						</li>
					{/if}
					<li class:active={$page.path === '/logout'}>
						<a sveltekit:prefetch href="/logout">Logout</a>
					</li>
				</ul>
			</nav>
		{/if}

		<section class="corner">
			<!-- TODO put something else here? github link? -->
		</section>
	</nav>
</header>

<style>
	header {
		display: flex;
		margin-bottom: 0.5rem;
		background: var(--primary-3);
	}
	nav {
		max-width: 1024px;
		margin: 0 auto;
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

	nav a {
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

	a:hover {
		color: var(--accent-color);
	}
</style>
