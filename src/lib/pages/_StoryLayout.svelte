<script lang="ts">
	/**
	 * Story-only shell — reproduces the route +layout.svelte chrome (AppHeader +
	 * UserChip) so page stories render in their real frame. It deliberately does
	 * NOT import `src/routes/+layout.svelte`: pulling a SvelteKit route file into
	 * the Storybook/Vitest module graph crosses SvelteKit's route-compilation
	 * boundary and crashes the Svelte runtime. The header wiring here mirrors
	 * `src/routes/+layout.svelte`.
	 */
	import type { Snippet } from 'svelte';
	import { AppHeader, UserChip } from '$lib';
	import { mockUser } from '../mocks/user';

	interface Props {
		user?: NonNullable<App.Locals['user']>;
		children: Snippet;
	}

	let { user = mockUser(), children }: Props = $props();

	let nav = $derived([
		{ label: 'Members', href: '/', active: true },
		...(user.roles?.includes('board')
			? [
					{ label: 'Changes', href: '/changes', active: false },
					{ label: 'Mail', href: '/mail', active: false }
				]
			: [])
	]);
</script>

<div class="root">
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

	{@render children()}
</div>

<style>
	.root {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
