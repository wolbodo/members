<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { AppHeader, UserChip } from '$lib';
	import type { LayoutServerData } from './$types';

	interface Props {
		data: LayoutServerData;
		children?: Snippet;
	}

	let { data, children }: Props = $props();

	let user = $derived(data.user);
	let path = $derived(page.url.pathname);

	let nav = $derived(
		user
			? [
					{ label: 'Members', href: '/', active: path === '/' || path.startsWith('/m/') },
					...(user.roles?.includes('board')
						? [
								{ label: 'Changes', href: '/changes', active: path === '/changes' },
								{ label: 'Mail', href: '/mail', active: path === '/mail' }
							]
						: [])
				]
			: []
	);
</script>

<div class="root">
	{#if user}
		<AppHeader {nav}>
			{#snippet trailing()}
				<UserChip name={user.name}>
					{#snippet menu()}
						<a href="/m/{user.name}">My profile</a>
						<hr />
						<a href="/auth/logout" class="danger">Log out</a>
					{/snippet}
				</UserChip>
			{/snippet}
		</AppHeader>
	{/if}

	{@render children?.()}
</div>

<style>
	.root {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
