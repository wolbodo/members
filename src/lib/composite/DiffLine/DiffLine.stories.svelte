<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DiffLine from './DiffLine.svelte';

	const { Story } = defineMeta({
		title: 'Composite/DiffLine',
		component: DiffLine
	});
</script>

<Story
	name="Address change"
	args={{ field: 'address', oldValue: 'Ternatestraat 105', newValue: 'Verwersdijk 104' }}
/>

<Story
	name="From null"
	args={{ field: 'country', oldValue: null, newValue: 'Nederland' }}
/>

<Story name="Password" args={{ field: 'password', oldValue: 'x', newValue: 'y' }} />

<Story name="Block">
	{#snippet template()}
		<div
			style="background: var(--bg-s); border-radius:7px; padding:12px 14px; max-width:480px;"
		>
			<DiffLine field="address" oldValue="Ternatestraat 105" newValue="Verwersdijk 104" />
			<DiffLine field="country" oldValue={null} newValue="Nederland" />
			<DiffLine field="password" oldValue="x" newValue="y" />
		</div>
	{/snippet}
</Story>
