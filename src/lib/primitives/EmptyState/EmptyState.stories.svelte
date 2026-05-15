<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import EmptyState from './EmptyState.svelte';

	const { Story } = defineMeta({
		title: 'Primitives/EmptyState',
		component: EmptyState
	});
</script>

<Story name="Nobody here yet">
	{#snippet template()}
		<EmptyState>Nobody here yet.</EmptyState>
	{/snippet}
</Story>

<Story name="No changes">
	{#snippet template()}
		<EmptyState>No changes recorded.</EmptyState>
	{/snippet}
</Story>
