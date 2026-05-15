<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Textarea from './Textarea.svelte';

	const { Story } = defineMeta({
		title: 'Form/Textarea',
		component: Textarea
	});
</script>

<Story name="Default" args={{ value: 'Prospective member — invited at Wolbocafé 2026-05-13.' }} />
<Story name="Empty" args={{ value: '', placeholder: 'Notes…' }} />
