<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import { z } from 'zod';
	import MemberDetailPage from '../../routes/m/[identifier]/+page.svelte';
	import StoryLayout from './_StoryLayout.svelte';
	import { world } from '../mocks/world';
	import {
		PagePersonDetailSchema,
		PageRoleSchema,
		type PagePersonDetail,
		type PageRole
	} from '../mocks/schemas';
	import { mockUser } from '../mocks/user';

	const user = mockUser({ name: 'Klaas', roles: ['board', 'self'] });

	const person = world.generate(PagePersonDetailSchema) as PagePersonDetail;
	const roles = world.generate(z.array(PageRoleSchema).min(3).max(3)) as PageRole[];
	// one ended role for the history section
	const pastRole: PageRole = {
		id: 99,
		person_id: person.id,
		role: 'wolpop',
		valid_from: new Date(2018, 8, 1),
		valid_till: new Date(2021, 5, 30)
	};

	const pageState = {
		url: new URL(`http://localhost/m/${person.name.toLowerCase()}`),
		params: { identifier: person.name.toLowerCase() },
		route: { id: '/m/[identifier]' },
		status: 200,
		error: null,
		data: {},
		state: {},
		form: null
	};

	const { Story } = defineMeta({
		title: 'Pages/Member detail',
		component: MemberDetailPage,
		parameters: {
			layout: 'fullscreen',
			sveltekit_experimental: {
				state: { page: pageState },
				navigation: { goto: fn() },
				forms: { enhance: () => ({ destroy() {} }) }
			}
		}
	});
</script>

<Story
	name="Board viewing member"
	args={{
		data: { person, roles: [...roles, pastRole], isBoard: true, isSelf: false }
	}}
>
	{#snippet template(args)}
		<StoryLayout {user}>
			<MemberDetailPage {...args} />
		</StoryLayout>
	{/snippet}
</Story>

<Story
	name="Self (read-only fields where board-gated)"
	args={{
		data: { person, roles, isBoard: false, isSelf: true }
	}}
>
	{#snippet template(args)}
		<StoryLayout user={mockUser({ name: person.name, roles: ['member', 'self'] })}>
			<MemberDetailPage {...args} />
		</StoryLayout>
	{/snippet}
</Story>

<Story name="Not found" args={{ data: { person: null, roles: [], isBoard: true, isSelf: false } }}>
	{#snippet template(args)}
		<StoryLayout {user}>
			<MemberDetailPage {...args} />
		</StoryLayout>
	{/snippet}
</Story>
