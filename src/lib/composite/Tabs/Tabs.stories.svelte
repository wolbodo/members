<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent, within } from 'storybook/test';
	import Tabs from './Tabs.svelte';
	import Tab from './Tab.svelte';

	const { Story } = defineMeta({
		title: 'Composite/Tabs',
		component: Tabs
	});

	const onEveryone = fn();
</script>

<Story name="Members active">
	{#snippet template()}
		<Tabs>
			<Tab active count={18}>Members</Tab>
			<Tab count={22}>Everyone</Tab>
		</Tabs>
	{/snippet}
</Story>

<Story name="Everyone active">
	{#snippet template()}
		<Tabs>
			<Tab count={18}>Members</Tab>
			<Tab active count={22}>Everyone</Tab>
		</Tabs>
	{/snippet}
</Story>

<Story
	name="Click switches tab"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('tab', { name: /Everyone/ }));
		await expect(onEveryone).toHaveBeenCalledOnce();
	}}
>
	{#snippet template()}
		<Tabs>
			<Tab active count={18}>Members</Tab>
			<Tab count={22} onclick={onEveryone}>Everyone</Tab>
		</Tabs>
	{/snippet}
</Story>
