<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent, within } from 'storybook/test';
	import Tag from './Tag.svelte';
	import { ROLE_NAMES } from '../../roles';

	const { Story } = defineMeta({
		title: 'Primitives/Tag',
		component: Tag,
		argTypes: {
			role: { control: 'select', options: [...ROLE_NAMES] },
			since: { control: 'text' }
		}
	});
</script>

<Story name="Plain" args={{ role: 'board' }} />
<Story name="With since" args={{ role: 'board', since: '1-9-2019' }} />
<Story name="Removable" args={{ role: 'nerd', since: '15-12-2021', onremove: () => {} }} />

<Story name="Row">
	{#snippet template()}
		<div style="display:flex; gap:6px; flex-wrap:wrap;">
			<Tag role="board" since="1-9-2019" />
			<Tag role="member" since="1-9-2017" />
			<Tag role="nerd" since="15-12-2021" />
			<Tag role="muzikant" since="1-9-2019" />
		</div>
	{/snippet}
</Story>

<Story
	name="Remove fires onremove"
	args={{ role: 'nerd', since: '15-12-2021', onremove: fn() }}
	play={async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Remove role' }));
		await expect(args.onremove).toHaveBeenCalledOnce();
	}}
/>
