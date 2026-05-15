<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import SearchInput from './SearchInput.svelte';

	const { Story } = defineMeta({
		title: 'Form/SearchInput',
		component: SearchInput
	});
</script>

<Story name="Empty" args={{ value: '', placeholder: 'Search name, email, role…' }} />
<Story name="With value" args={{ value: 'klaas' }} />

<Story
	name="Type then clear"
	args={{ value: '', placeholder: 'Search…' }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('searchbox') as HTMLInputElement;

		await userEvent.type(input, 'klaas');
		await expect(input.value).toBe('klaas');

		await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
		await expect(input.value).toBe('');
	}}
/>
