<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { z } from 'zod';
	import ChangesPage from '../../routes/changes/+page.svelte';
	import StoryLayout from './_StoryLayout.svelte';
	import { world } from '../mocks/world';
	import { PageHistorySchema, type PageHistory } from '../mocks/schemas';
	import { mockUser } from '../mocks/user';

	const user = mockUser({ name: 'Klaas', roles: ['board', 'self'] });

	const history = world.generate(z.array(PageHistorySchema).min(8).max(8)) as PageHistory[];

	const pageState = {
		url: new URL('http://localhost/changes'),
		params: {},
		route: { id: '/changes' },
		status: 200,
		error: null,
		data: {},
		state: {},
		form: null
	};

	const { Story } = defineMeta({
		title: 'Pages/Changes',
		component: ChangesPage,
		parameters: {
			layout: 'fullscreen',
			sveltekit_experimental: { state: { page: pageState } }
		}
	});
</script>

<Story name="Default" args={{ data: { history } }}>
	{#snippet template(args)}
		<StoryLayout {user}>
			<ChangesPage {...args} />
		</StoryLayout>
	{/snippet}
</Story>

<Story name="Empty" args={{ data: { history: [] } }}>
	{#snippet template(args)}
		<StoryLayout {user}>
			<ChangesPage {...args} />
		</StoryLayout>
	{/snippet}
</Story>
