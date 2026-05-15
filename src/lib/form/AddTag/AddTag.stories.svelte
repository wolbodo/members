<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent, within } from 'storybook/test';
	import AddTag from './AddTag.svelte';

	const { Story } = defineMeta({
		title: 'Form/AddTag',
		component: AddTag
	});
</script>

<Story name="Default">
	{#snippet template()}
		<AddTag onadd={(role) => console.log('add role', role)} />
	{/snippet}
</Story>

<Story
	name="Open, type, confirm"
	args={{ onadd: fn() }}
	play={async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: '+ add role' }));
		const input = canvas.getByRole('textbox') as HTMLInputElement;
		await expect(input).toBeInTheDocument();

		await userEvent.type(input, 'board');
		await userEvent.keyboard('{Enter}');
		await expect(args.onadd).toHaveBeenCalledWith('board');
	}}
>
	{#snippet template(args)}
		<AddTag {...args} />
	{/snippet}
</Story>

<Story
	name="Escape cancels"
	args={{ onadd: fn() }}
	play={async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: '+ add role' }));
		await userEvent.type(canvas.getByRole('textbox'), 'board');
		await userEvent.keyboard('{Escape}');

		await expect(args.onadd).not.toHaveBeenCalled();
		await expect(canvas.getByRole('button', { name: '+ add role' })).toBeInTheDocument();
	}}
>
	{#snippet template(args)}
		<AddTag {...args} />
	{/snippet}
</Story>
