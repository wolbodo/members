<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Avatar from './Avatar.svelte';

	const { Story } = defineMeta({
		title: 'Primitives/Avatar',
		component: Avatar,
		argTypes: {
			initial: { control: 'text' },
			size: { control: { type: 'range', min: 16, max: 80, step: 2 } }
		}
	});
</script>

<Story name="Default" args={{ initial: 'K' }} />
<Story name="Large" args={{ initial: 'K', size: 56 }} />

<Story name="Row of sizes">
	{#snippet template()}
		<div style="display:flex; gap:12px; align-items:center;">
			<Avatar initial="K" size={20} />
			<Avatar initial="K" size={26} />
			<Avatar initial="K" size={40} />
			<Avatar initial="K" size={56} />
		</div>
	{/snippet}
</Story>
