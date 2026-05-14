<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { z } from 'zod';
	import MailPage from '../../routes/mail/+page.svelte';
	import StoryLayout from './_StoryLayout.svelte';
	import { world } from '../mocks/world';
	import { PageMailSchema, type PageMail } from '../mocks/schemas';
	import { mockUser } from '../mocks/user';

	const user = mockUser({ name: 'Klaas', roles: ['board', 'self'] });

	const mails = world.generate(z.array(PageMailSchema).min(10).max(10)) as PageMail[];

	const pageState = {
		url: new URL('http://localhost/mail'),
		params: {},
		route: { id: '/mail' },
		status: 200,
		error: null,
		data: {},
		state: {},
		form: null
	};

	const { Story } = defineMeta({
		title: 'Pages/Mail',
		component: MailPage,
		parameters: {
			layout: 'fullscreen',
			sveltekit_experimental: { state: { page: pageState } }
		}
	});
</script>

<Story name="Default" args={{ data: { mails } }}>
	{#snippet template(args)}
		<StoryLayout {user}>
			<MailPage {...args} />
		</StoryLayout>
	{/snippet}
</Story>

<Story name="Empty" args={{ data: { mails: [] } }}>
	{#snippet template(args)}
		<StoryLayout {user}>
			<MailPage {...args} />
		</StoryLayout>
	{/snippet}
</Story>
