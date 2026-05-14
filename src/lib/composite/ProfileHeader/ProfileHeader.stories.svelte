<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ProfileHeader from './ProfileHeader.svelte';

	const { Story } = defineMeta({
		title: 'Composite/ProfileHeader',
		component: ProfileHeader
	});
</script>

<Story
	name="Board member"
	args={{
		name: 'Klaas',
		realName: 'Klaas de Beer',
		since: '1-9-2017',
		id: 1,
		primaryRole: 'board'
	}}
/>

<Story
	name="Member only"
	args={{
		name: 'Sofie',
		realName: 'Sofie van Dam',
		since: '1-9-2018',
		id: 7,
		primaryRole: 'member'
	}}
/>
