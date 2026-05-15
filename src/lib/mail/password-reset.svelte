<script lang="ts">
	import { Link } from 'svelte-email';
	import Template from './Template.svelte';
	import { env } from '$env/dynamic/public';

	interface Props {
		person: { name: string };
		data: { token: string };
	}

	let { person, data }: Props = $props();

	const resetLink = $derived(`${env.PUBLIC_URL}/auth/reset?token=${data.token}`);
</script>

<Template subject="Reset your password">
	{#snippet header()}Hi {person.name},{/snippet}

	You or someone else requested a password reset. Follow
	<Link href={resetLink}>this link</Link> to proceed. This link is valid for 30 minutes.
</Template>
