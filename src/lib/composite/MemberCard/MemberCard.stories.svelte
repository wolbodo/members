<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent, within } from 'storybook/test';
	import MemberCard from './MemberCard.svelte';

	const { Story } = defineMeta({
		title: 'Composite/MemberCard',
		component: MemberCard
	});
</script>

<Story
	name="Klaas"
	args={{
		name: 'Klaas',
		fullName: 'Klaas de Beer',
		city: 'Delft',
		email: 'klaas@debeer.nl',
		phone: '06-12345678',
		roles: ['member', 'board', 'nerd']
	}}
/>

<Story name="List">
	{#snippet template()}
		<div style="display:flex; flex-direction:column; gap:8px; max-width:420px;">
			<MemberCard
				name="Klaas"
				fullName="Klaas de Beer"
				city="Delft"
				email="klaas@debeer.nl"
				phone="06-12345678"
				roles={['member', 'board', 'nerd']}
			/>
			<MemberCard
				name="Sofie"
				fullName="Sofie van Dam"
				city="Delft"
				email="s.vandam@gmail.com"
				phone="06-23456789"
				roles={['member']}
			/>
			<MemberCard
				name="Joep"
				fullName="Joep Peters"
				city="Delft"
				email="joeppeters@hotmail.com"
				roles={['board', 'member']}
			/>
		</div>
	{/snippet}
</Story>

<Story
	name="Card click fires"
	args={{
		name: 'Klaas',
		fullName: 'Klaas de Beer',
		city: 'Delft',
		email: 'klaas@debeer.nl',
		roles: ['member', 'board'],
		onclick: fn()
	}}
	play={async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button'));
		await expect(args.onclick).toHaveBeenCalledOnce();
	}}
/>
