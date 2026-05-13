<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import Toggle from './Toggle.svelte';

	const { Story } = defineMeta({
		title: 'Lib/Toggle',
		component: Toggle,
		argTypes: {
			checked: { control: 'boolean' },
			disabled: { control: 'boolean' }
		}
	});
</script>

<Story name="Unchecked" args={{ checked: false }}>
	{#snippet template(args)}
		<Toggle {...args}>Show all people</Toggle>
	{/snippet}
</Story>

<Story name="Checked" args={{ checked: true }}>
	{#snippet template(args)}
		<Toggle {...args}>Show only members</Toggle>
	{/snippet}
</Story>

<Story
	name="Click toggles state"
	args={{ checked: false }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const checkbox = canvas.getByRole('checkbox');
		await expect(checkbox).not.toBeChecked();
		await userEvent.click(checkbox);
		await expect(checkbox).toBeChecked();
	}}
>
	{#snippet template(args)}
		<Toggle {...args}>Toggle me</Toggle>
	{/snippet}
</Story>
