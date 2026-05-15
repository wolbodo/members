<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent, within } from 'storybook/test';
	import Pill from './Pill.svelte';

	const { Story } = defineMeta({
		title: 'Primitives/Pill',
		component: Pill,
		argTypes: {
			active: { control: 'boolean' }
		}
	});
</script>

<Story name="Inactive" args={{ active: false }}>
	{#snippet template(args)}
		<Pill {...args}>member</Pill>
	{/snippet}
</Story>

<Story name="Active" args={{ active: true }}>
	{#snippet template(args)}
		<Pill {...args}>member</Pill>
	{/snippet}
</Story>

<Story name="Filter row">
	{#snippet template()}
		<div style="display:flex; gap:5px; flex-wrap:wrap;">
			<Pill active>member</Pill>
			<Pill>board</Pill>
			<Pill>nerd</Pill>
			<Pill>muzikant</Pill>
			<Pill>im</Pill>
			<Pill>klusser</Pill>
		</div>
	{/snippet}
</Story>

<Story
	name="Click fires onclick"
	args={{ active: false, onclick: fn() }}
	play={async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button'));
		await expect(args.onclick).toHaveBeenCalledOnce();
	}}
>
	{#snippet template(args)}
		<Pill {...args}>member</Pill>
	{/snippet}
</Story>
