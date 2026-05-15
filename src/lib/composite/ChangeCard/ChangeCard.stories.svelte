<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ChangeCard from './ChangeCard.svelte';

	const { Story } = defineMeta({
		title: 'Composite/ChangeCard',
		component: ChangeCard
	});
</script>

<Story
	name="Recent change"
	args={{
		author: 'Klaas',
		time: '3-5-2026 16:22',
		fields: [
			{ field: 'name', old: null, new: 'Dex' },
			{ field: 'email', old: null, new: 'dex@fontijn.xyz' },
			{ field: 'note', old: null, new: 'Prospective member…' }
		]
	}}
/>
