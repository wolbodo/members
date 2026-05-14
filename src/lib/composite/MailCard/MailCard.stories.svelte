<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import MailCard from './MailCard.svelte';

	const { Story } = defineMeta({
		title: 'Composite/MailCard',
		component: MailCard
	});
</script>

<Story
	name="Pending"
	args={{
		to: 'Dex',
		email: 'dex@fontijn.xyz',
		template: 'password-reset',
		time: '13-5-2026 09:01',
		status: 'pending'
	}}
/>

<Story
	name="Sent"
	args={{
		to: 'Klaas',
		email: 'klaas@debeer.nl',
		template: 'password-change-notification',
		time: '1-3-2026 11:00',
		status: 'sent'
	}}
/>
