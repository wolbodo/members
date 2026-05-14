<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Badge from './Badge.svelte';

	const { Story } = defineMeta({
		title: 'Primitives/Badge',
		component: Badge,
		argTypes: {
			status: { control: 'select', options: ['sent', 'pending'] }
		}
	});
</script>

<Story name="Sent" args={{ status: 'sent' }} />
<Story name="Pending" args={{ status: 'pending' }} />
