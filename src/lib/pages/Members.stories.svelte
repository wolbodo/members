<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import { z } from 'zod';
	import MembersPage from '../../routes/+page.svelte';
	import StoryLayout from './_StoryLayout.svelte';
	import { world } from '../mocks/world';
	import { PageMemberSchema, type PageMember } from '../mocks/schemas';
	import { mockUser } from '../mocks/user';

	const user = mockUser({ name: 'Klaas', roles: ['board', 'self'] });
	const memberUser = mockUser({ name: 'Sofie', roles: ['member', 'self'] });

	const people = world.generate(z.array(PageMemberSchema).min(18).max(18)) as PageMember[];

	const pageState = {
		url: new URL('http://localhost/'),
		params: {},
		route: { id: '/' },
		status: 200,
		error: null,
		data: {},
		state: {},
		form: null
	};

	const { Story } = defineMeta({
		title: 'Pages/Members',
		component: MembersPage,
		parameters: {
			layout: 'fullscreen',
			sveltekit_experimental: {
				state: { page: pageState },
				navigation: { goto: fn() }
			}
		}
	});
</script>

<Story name="Board view" args={{ data: { people, user } }}>
	{#snippet template(args)}
		<StoryLayout {user}>
			<MembersPage {...args} />
		</StoryLayout>
	{/snippet}
</Story>

<Story name="Member view" args={{ data: { people, user: memberUser } }}>
	{#snippet template(args)}
		<StoryLayout user={memberUser}>
			<MembersPage {...args} />
		</StoryLayout>
	{/snippet}
</Story>

<Story name="Empty" args={{ data: { people: [], user } }}>
	{#snippet template(args)}
		<StoryLayout {user}>
			<MembersPage {...args} />
		</StoryLayout>
	{/snippet}
</Story>
