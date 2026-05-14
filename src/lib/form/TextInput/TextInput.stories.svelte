<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import TextInput from './TextInput.svelte';

	const { Story } = defineMeta({
		title: 'Form/TextInput',
		component: TextInput,
		argTypes: {
			type: { control: 'select', options: ['text', 'email', 'tel', 'password'] },
			placeholder: { control: 'text' },
			disabled: { control: 'boolean' }
		}
	});
</script>

<Story name="Default" args={{ value: 'Klaas' }} />
<Story name="Email" args={{ type: 'email', value: 'klaas@debeer.nl' }} />
<Story name="Empty placeholder" args={{ value: '', placeholder: 'Type a nickname…' }} />

<Story
	name="Typing updates value"
	args={{ value: '' }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox') as HTMLInputElement;
		await userEvent.type(input, 'Dex');
		await expect(input.value).toBe('Dex');
	}}
/>
