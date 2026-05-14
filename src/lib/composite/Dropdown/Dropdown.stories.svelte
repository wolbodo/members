<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within } from 'storybook/test';
	import Dropdown from './Dropdown.svelte';

	const { Story } = defineMeta({
		title: 'Composite/Dropdown',
		component: Dropdown
	});
</script>

<Story
	name="User menu"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button', { name: 'My profile' })).toBeInTheDocument();
		const logout = canvas.getByRole('button', { name: 'Log out' });
		await expect(logout).toHaveClass('danger');
	}}
>
	{#snippet template()}
		<Dropdown>
			<button>My profile</button>
			<hr />
			<button class="danger">Log out</button>
		</Dropdown>
	{/snippet}
</Story>
