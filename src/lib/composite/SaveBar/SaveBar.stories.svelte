<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent, within } from 'storybook/test';
	import SaveBar from './SaveBar.svelte';

	const { Story } = defineMeta({
		title: 'Composite/SaveBar',
		component: SaveBar
	});
</script>

<Story
	name="Dirty"
	args={{
		state: 'dirty',
		message: 'Unsaved changes',
		ondiscard: () => {},
		onsave: () => {}
	}}
/>

<Story name="Saved" args={{ state: 'saved', message: 'Saved' }} />

<Story
	name="Discard / Save fire callbacks"
	args={{ state: 'dirty', message: 'Unsaved changes', ondiscard: fn(), onsave: fn() }}
	play={async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Discard' }));
		await expect(args.ondiscard).toHaveBeenCalledOnce();
		await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
		await expect(args.onsave).toHaveBeenCalledOnce();
	}}
/>
