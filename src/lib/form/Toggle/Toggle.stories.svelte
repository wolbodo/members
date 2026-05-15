<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import Toggle from './Toggle.svelte';

	const { Story } = defineMeta({
		title: 'Form/Toggle',
		component: Toggle,
		argTypes: {
			checked: { control: 'boolean' },
			disabled: { control: 'boolean' }
		}
	});
</script>

<Story name="Off" args={{ checked: false }}>
	{#snippet template(args)}
		<Toggle {...args}>Allow register</Toggle>
	{/snippet}
</Story>

<Story name="On" args={{ checked: true }}>
	{#snippet template(args)}
		<Toggle {...args}>Allow door</Toggle>
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
