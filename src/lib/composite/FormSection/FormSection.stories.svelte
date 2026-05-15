<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FormSection from './FormSection.svelte';
	import Field from '../../form/Field/Field.svelte';
	import TextInput from '../../form/TextInput/TextInput.svelte';

	const { Story } = defineMeta({
		title: 'Composite/FormSection',
		component: FormSection
	});
</script>

<Story name="Identity">
	{#snippet template()}
		<div style="max-width:680px;">
			<FormSection label="Identity">
				<Field label="Nickname" span2>
					<TextInput value="Klaas" />
				</Field>
				<Field label="First name">
					<TextInput value="Klaas" />
				</Field>
				<Field label="Last name">
					<TextInput value="de Beer" />
				</Field>
			</FormSection>
			<FormSection label="Contact">
				<Field label="Email">
					<TextInput type="email" value="klaas@debeer.nl" />
				</Field>
				<Field label="Phone">
					<TextInput type="tel" value="06-12345678" />
				</Field>
			</FormSection>
		</div>
	{/snippet}
</Story>
