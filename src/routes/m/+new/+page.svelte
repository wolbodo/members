<script lang="ts">
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { PageShell, FormSection, Field, TextInput, Textarea, Toggle, Button, SaveBar } from '$lib';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance } = superForm(data.form, { resetForm: false });
</script>

<svelte:head>
	<title>New member — Wolbodo Members</title>
</svelte:head>

<PageShell maxWidth="800px">
	<Button variant="back" onclick={() => goto('/')}>← members</Button>

	<h1 class="t-heading" style="margin-bottom: 22px;">New member</h1>

	<form method="post" use:enhance>
		<FormSection label="Identity">
			<Field label="Nickname" span2 error={$errors.name?.[0]}>
				<TextInput name="name" bind:value={$form.name} />
			</Field>
			<Field label="First name" error={$errors.firstname?.[0]}>
				<TextInput name="firstname" bind:value={$form.firstname as string} />
			</Field>
			<Field label="Last name" error={$errors.lastname?.[0]}>
				<TextInput name="lastname" bind:value={$form.lastname as string} />
			</Field>
		</FormSection>

		<FormSection label="Contact">
			<Field label="Email" error={$errors.email?.[0]}>
				<TextInput type="email" name="email" bind:value={$form.email as string} />
			</Field>
			<Field label="Phone" error={$errors.phone?.[0]}>
				<TextInput type="tel" name="phone" bind:value={$form.phone as string} />
			</Field>
		</FormSection>

		<FormSection label="Location">
			<Field label="Address" span2 error={$errors.address?.[0]}>
				<TextInput name="address" bind:value={$form.address as string} />
			</Field>
			<Field label="Zipcode" error={$errors.zipcode?.[0]}>
				<TextInput name="zipcode" bind:value={$form.zipcode as string} />
			</Field>
			<Field label="City" error={$errors.city?.[0]}>
				<TextInput name="city" bind:value={$form.city as string} />
			</Field>
			<Field label="Country" span2 error={$errors.country?.[0]}>
				<TextInput name="country" bind:value={$form.country as string} />
			</Field>
		</FormSection>

		<FormSection label="System">
			<Field label="Bank account" error={$errors.bankaccount?.[0]}>
				<TextInput name="bankaccount" bind:value={$form.bankaccount as string} />
			</Field>
			<Field label="Key code" error={$errors.key_code?.[0]}>
				<TextInput name="key_code" bind:value={$form.key_code as string} />
			</Field>
			<Field label="Permissions" span2>
				<div style="display:flex; gap:20px; padding:6px 0; flex-wrap:wrap;">
					<Toggle name="allow_register" bind:checked={$form.allow_register}>Allow register</Toggle>
					<Toggle name="allow_door" bind:checked={$form.allow_door}>Allow door</Toggle>
				</div>
			</Field>
			<Field label="Password" span2 error={$errors.password?.[0]}>
				<TextInput type="password" name="password" bind:value={$form.password as string} />
			</Field>
		</FormSection>

		<FormSection label="Notes">
			<Field label="Note" span2 error={$errors.note?.[0]}>
				<Textarea name="note" bind:value={$form.note as string} />
			</Field>
		</FormSection>

		<div class="save-wrap">
			<SaveBar
				state="dirty"
				message="New member"
				saveLabel="Create member"
				onsave={() => document.querySelector('form')?.requestSubmit()}
			/>
		</div>
	</form>
</PageShell>

<style>
	.save-wrap {
		position: fixed;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 500;
	}
	@media (max-width: 600px) {
		.save-wrap {
			left: 14px;
			right: 14px;
			bottom: 14px;
			transform: none;
		}
	}
</style>
