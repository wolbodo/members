<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import UserChip from './UserChip.svelte';

	const { Story } = defineMeta({
		title: 'Composite/UserChip',
		component: UserChip
	});
</script>

<Story name="Klaas">
	{#snippet template()}
		<UserChip name="Klaas">
			{#snippet menu()}
				<button>My profile</button>
				<hr />
				<button class="danger">Log out</button>
			{/snippet}
		</UserChip>
	{/snippet}
</Story>

<Story
	name="Click toggles menu"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const chip = canvas.getByRole('button', { name: /Klaas/ });

		await expect(canvas.queryByRole('button', { name: 'My profile' })).not.toBeInTheDocument();
		await userEvent.click(chip);
		await expect(canvas.getByRole('button', { name: 'My profile' })).toBeInTheDocument();

		await userEvent.click(document.body);
		await expect(canvas.queryByRole('button', { name: 'My profile' })).not.toBeInTheDocument();
	}}
>
	{#snippet template()}
		<UserChip name="Klaas">
			{#snippet menu()}
				<button>My profile</button>
				<hr />
				<button class="danger">Log out</button>
			{/snippet}
		</UserChip>
	{/snippet}
</Story>
