<script>
	import Template from './Template.svelte';
	import { env } from '$env/dynamic/public';
	export let person;
	export let data;

	$: resetLink = `${env.PUBLIC_URL}/auth/reset?token=${data.token}`;
</script>

<Template subject="Reset your password">
	<h1 slot="header">Hi {person.name},</h1>

	<mj-column>
		<mj-text>
			You, or someone else has requested a password reset. Please follow <a href={resetLink}
				>this link</a
			> to proceed.
		</mj-text>
		<mj-text>This link will be valid for 30 minutes</mj-text>
	</mj-column>
</Template>
