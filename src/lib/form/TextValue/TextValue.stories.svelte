<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TextValue from './TextValue.svelte';

	const { Story } = defineMeta({
		title: 'Form/TextValue',
		component: TextValue
	});
</script>

<Story name="Value" args={{ value: '06-12345678' }} />
<Story name="Empty" args={{ value: null }} />
<Story name="Mono" args={{ value: 'klaas@debeer.nl', mono: true }} />
