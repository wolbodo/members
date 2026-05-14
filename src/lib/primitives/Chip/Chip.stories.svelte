<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Chip from './Chip.svelte';
	import { ROLE_NAMES } from '../../roles';

	const { Story } = defineMeta({
		title: 'Primitives/Chip',
		component: Chip,
		argTypes: {
			role: { control: 'select', options: [...ROLE_NAMES] }
		}
	});
</script>

<Story name="Member" args={{ role: 'member' }} />
<Story name="Board" args={{ role: 'board' }} />
<Story name="Nerd" args={{ role: 'nerd' }} />

<Story name="All roles">
	{#snippet template()}
		<div style="display:flex; gap:6px; flex-wrap:wrap;">
			{#each ROLE_NAMES as role (role)}
				<Chip {role} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Clickable (filter)" args={{ role: 'member', onclick: () => console.log('filter') }} />
