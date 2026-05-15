<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent, within } from 'storybook/test';
	import Button from './Button.svelte';

	const { Story } = defineMeta({
		title: 'Primitives/Button',
		component: Button,
		argTypes: {
			variant: { control: 'select', options: ['primary', 'outline', 'ghost', 'back'] },
			disabled: { control: 'boolean' }
		}
	});
</script>

<Story name="Primary" args={{ variant: 'primary' }}>
	{#snippet template(args)}
		<Button {...args}>Save changes</Button>
	{/snippet}
</Story>

<Story name="Primary with icon" args={{ variant: 'primary' }}>
	{#snippet template(args)}
		<Button {...args}>+ New member</Button>
	{/snippet}
</Story>

<Story name="Disabled" args={{ variant: 'primary', disabled: true }}>
	{#snippet template(args)}
		<Button {...args}>Saving…</Button>
	{/snippet}
</Story>

<Story name="Outline" args={{ variant: 'outline' }}>
	{#snippet template(args)}
		<Button {...args}>Cancel</Button>
	{/snippet}
</Story>

<Story name="Ghost" args={{ variant: 'ghost' }}>
	{#snippet template(args)}
		<Button {...args}>Discard</Button>
	{/snippet}
</Story>

<Story name="Back" args={{ variant: 'back' }}>
	{#snippet template(args)}
		<Button {...args}>← members</Button>
	{/snippet}
</Story>

<Story
	name="Click fires onclick"
	args={{ variant: 'primary', onclick: fn() }}
	play={async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button'));
		await expect(args.onclick).toHaveBeenCalledOnce();
	}}
>
	{#snippet template(args)}
		<Button {...args}>Save changes</Button>
	{/snippet}
</Story>

<Story
	name="Disabled blocks onclick"
	args={{ variant: 'primary', disabled: true, onclick: fn() }}
	play={async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button'));
		await expect(args.onclick).not.toHaveBeenCalled();
	}}
>
	{#snippet template(args)}
		<Button {...args}>Saving…</Button>
	{/snippet}
</Story>
