<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Field from './Field.svelte';
	import TextInput from '../TextInput/TextInput.svelte';
	import TextValue from '../TextValue/TextValue.svelte';

	const { Story } = defineMeta({
		title: 'Form/Field',
		component: Field
	});
</script>

<Story name="With text input">
	{#snippet template()}
		<Field label="Nickname">
			<TextInput value="Klaas" />
		</Field>
	{/snippet}
</Story>

<Story name="Read-only">
	{#snippet template()}
		<Field label="Phone">
			<TextValue value="06-12345678" />
		</Field>
	{/snippet}
</Story>

<Story name="Empty value">
	{#snippet template()}
		<Field label="City">
			<TextValue value={null} />
		</Field>
	{/snippet}
</Story>
