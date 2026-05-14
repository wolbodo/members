<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import {
		PageShell,
		FormSection,
		Field,
		TextInput,
		Textarea,
		Toggle,
		Button
	} from '$lib';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<svelte:head>
	<title>New member — Wolbodo Members</title>
</svelte:head>

<PageShell maxWidth="800px">
	<Button variant="back" onclick={() => goto('/')}>← members</Button>

	<h1 class="t-heading" style="margin-bottom: 22px;">New member</h1>

	<form method="post" use:enhance>
		<FormSection label="Identity">
			<Field label="Nickname" span2>
				<TextInput name="name" value="" />
			</Field>
			<Field label="First name">
				<TextInput name="firstname" value="" />
			</Field>
			<Field label="Last name">
				<TextInput name="lastname" value="" />
			</Field>
		</FormSection>

		<FormSection label="Contact">
			<Field label="Email">
				<TextInput type="email" name="email" value="" />
			</Field>
			<Field label="Phone">
				<TextInput type="tel" name="phone" value="" />
			</Field>
		</FormSection>

		<FormSection label="Location">
			<Field label="Address" span2>
				<TextInput name="address" value="" />
			</Field>
			<Field label="Zipcode">
				<TextInput name="zipcode" value="" />
			</Field>
			<Field label="City">
				<TextInput name="city" value="" />
			</Field>
			<Field label="Country" span2>
				<TextInput name="country" value="" />
			</Field>
		</FormSection>

		<FormSection label="System">
			<Field label="Bank account">
				<TextInput name="bankaccount" value="" />
			</Field>
			<Field label="Key code">
				<TextInput name="key_code" value="" />
			</Field>
			<Field label="Permissions" span2>
				<div style="display:flex; gap:20px; padding:6px 0; flex-wrap:wrap;">
					<Toggle name="allow_register" checked={false}>Allow register</Toggle>
					<Toggle name="allow_door" checked={false}>Allow door</Toggle>
				</div>
			</Field>
			<Field label="Password" span2>
				<TextInput type="password" name="password" value="" />
			</Field>
		</FormSection>

		<FormSection label="Notes">
			<Field label="Note" span2>
				<Textarea name="note" value="" />
			</Field>
		</FormSection>

		<div class="submit">
			<Button type="submit" variant="primary">Create member</Button>
		</div>
	</form>
</PageShell>

<style>
	.submit {
		display: flex;
		justify-content: flex-end;
		margin-top: 24px;
	}
</style>
