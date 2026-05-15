<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { datetime, formatDate } from '$lib/format';
	import {
		PageShell,
		ProfileHeader,
		FormSection,
		Field,
		TextInput,
		TextValue,
		Textarea,
		Toggle,
		Tag,
		AddTag,
		Button,
		SaveBar,
		EmptyState
	} from '$lib';
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

	let person = $derived(data.person);
	let isBoard = $derived(data.isBoard);
	let isSelf = $derived(data.isSelf);
	let canEdit = $derived(isBoard || isSelf);

	let activeRoles = $derived(data.roles.filter((r) => !r.valid_till));
	let pastRoles = $derived(data.roles.filter((r) => r.valid_till));
	let primaryRole = $derived(activeRoles[0]?.role ?? 'member');
	let memberRole = $derived(activeRoles.find((r) => r.role === 'member'));
	let memberSince = $derived(
		memberRole?.valid_from ? formatDate(String(memberRole.valid_from)) : null
	);

	let dirty = $state(false);
	let saved = $state(false);
	let saveTimer: ReturnType<typeof setTimeout> | null = null;
</script>

<svelte:head>
	<title>{person?.name ?? 'Member'} — Wolbodo Members</title>
</svelte:head>

<PageShell maxWidth="800px">
	{#if !person}
		<EmptyState>Person not found.</EmptyState>
	{:else}
		<Button variant="back" onclick={() => goto('/')}>← members</Button>

		<ProfileHeader
			name={person.name}
			realName={[person.firstname, person.lastname].filter(Boolean).join(' ') || undefined}
			since={memberSince ?? undefined}
			id={person.id}
			{primaryRole}
		/>

		<div class="roles">
			{#each activeRoles as r (r.id)}
				{#if isBoard}
					<form method="post" action="?/stopRole" use:enhance style="display:inline-flex">
						<input type="hidden" name="roleId" value={r.id} />
						<Tag
							role={r.role}
							since={r.valid_from ? formatDate(String(r.valid_from)) : undefined}
							onremove={() => {
								(document.activeElement as HTMLButtonElement)?.closest('form')?.requestSubmit();
							}}
						/>
					</form>
				{:else}
					<Tag role={r.role} since={r.valid_from ? formatDate(String(r.valid_from)) : undefined} />
				{/if}
			{/each}

			{#if isBoard}
				<form method="post" action="?/addRole" use:enhance style="display:inline-flex">
					<input type="hidden" name="personId" value={person.id} />
					<AddTag
						onadd={(role) => {
							const form = document.createElement('input');
							form.type = 'hidden';
							form.name = 'role';
							form.value = role;
							// the form just below contains personId; we submit by appending role
							const realForm = (document.activeElement as HTMLElement)?.closest('form');
							if (realForm) {
								const existing = realForm.querySelector('input[name=role]');
								if (existing) existing.remove();
								realForm.appendChild(form);
								realForm.requestSubmit();
							}
						}}
					/>
				</form>
			{/if}
		</div>

		<form
			method="post"
			action="?/edit"
			use:enhance={() =>
				async ({ result, update }) => {
					await update();
					if (result.type === 'success') {
						dirty = false;
						saved = true;
						if (saveTimer) clearTimeout(saveTimer);
						saveTimer = setTimeout(() => (saved = false), 2500);
					}
				}}
			oninput={() => (dirty = true)}
		>
			<input type="hidden" name="id" value={person.id} />

			<FormSection label="Identity">
				<Field label="Nickname" span2>
					{#if canEdit && isBoard}
						<TextInput name="name" value={person.name} />
					{:else}
						<TextValue value={person.name} />
					{/if}
				</Field>
				<Field label="First name">
					{#if canEdit}
						<TextInput name="firstname" value={person.firstname ?? ''} />
					{:else}
						<TextValue value={person.firstname} />
					{/if}
				</Field>
				<Field label="Last name">
					{#if canEdit}
						<TextInput name="lastname" value={person.lastname ?? ''} />
					{:else}
						<TextValue value={person.lastname} />
					{/if}
				</Field>
			</FormSection>

			<FormSection label="Contact">
				<Field label="Email">
					{#if canEdit}
						<TextInput type="email" name="email" value={person.email ?? ''} />
					{:else}
						<TextValue value={person.email} />
					{/if}
				</Field>
				<Field label="Phone">
					{#if canEdit}
						<TextInput type="tel" name="phone" value={person.phone ?? ''} />
					{:else}
						<TextValue value={person.phone} />
					{/if}
				</Field>
			</FormSection>

			<FormSection label="Location">
				<Field label="Address" span2>
					{#if canEdit}
						<TextInput name="address" value={person.address ?? ''} />
					{:else}
						<TextValue value={person.address} />
					{/if}
				</Field>
				<Field label="Zipcode">
					{#if canEdit}
						<TextInput name="zipcode" value={person.zipcode ?? ''} />
					{:else}
						<TextValue value={person.zipcode} />
					{/if}
				</Field>
				<Field label="City">
					{#if canEdit}
						<TextInput name="city" value={person.city ?? ''} />
					{:else}
						<TextValue value={person.city} />
					{/if}
				</Field>
				<Field label="Country" span2>
					{#if canEdit}
						<TextInput name="country" value={person.country ?? ''} />
					{:else}
						<TextValue value={person.country} />
					{/if}
				</Field>
			</FormSection>

			{#if isBoard || isSelf}
				<FormSection label="System">
					<Field label="Bank account">
						{#if canEdit}
							<TextInput name="bankaccount" value={person.bankaccount ?? ''} />
						{:else}
							<TextValue value={person.bankaccount} mono />
						{/if}
					</Field>
					{#if isBoard}
						<Field label="Key code">
							{#if canEdit}
								<TextInput name="key_code" value={person.key_code ?? ''} />
							{:else}
								<TextValue value={person.key_code} mono />
							{/if}
						</Field>
					{/if}
					<Field label="Permissions" span2>
						<div style="display:flex; gap:20px; padding:6px 0; flex-wrap:wrap;">
							<Toggle
								name="allow_register"
								checked={Boolean(person.allow_register)}
								disabled={!canEdit}
							>
								Allow register
							</Toggle>
							<Toggle name="allow_door" checked={Boolean(person.allow_door)} disabled={!canEdit}>
								Allow door
							</Toggle>
						</div>
					</Field>
					{#if canEdit}
						<Field label="New password" span2>
							<TextInput
								type="password"
								name="password"
								value=""
								placeholder="Leave empty to keep"
							/>
						</Field>
					{/if}
				</FormSection>
			{/if}

			{#if isBoard}
				<FormSection label="Notes">
					<Field label="Note" span2>
						<Textarea name="note" value={person.note ?? ''} />
					</Field>
				</FormSection>
			{/if}

			{#if pastRoles.length > 0}
				<FormSection label="Role history">
					<div class="rh" style="grid-column:1/-1">
						{#each pastRoles as r (r.id)}
							<div class="rh-item">
								<span class="rh-role">{r.role}</span>
								<span class="rh-range t-small">
									{r.valid_from ? formatDate(String(r.valid_from)) : '?'} →
									{r.valid_till ? formatDate(String(r.valid_till)) : '?'}
								</span>
							</div>
						{/each}
					</div>
				</FormSection>
			{/if}

			<div class="meta">
				<span class="t-dimmer">created: {datetime(String(person.created))}</span>
				<span class="t-dimmer">modified: {datetime(String(person.modified))}</span>
			</div>

			{#if canEdit && (dirty || saved)}
				<div class="save-wrap">
					{#if saved && !dirty}
						<SaveBar state="saved" message="Saved" />
					{:else}
						<SaveBar
							state="dirty"
							message="Unsaved changes"
							ondiscard={() => location.reload()}
							onsave={() => {
								const form = (document.activeElement as HTMLElement)?.closest('form');
								(form ?? document.querySelector('form[action="?/edit"]'))?.requestSubmit();
							}}
						/>
					{/if}
				</div>
			{/if}
		</form>
	{/if}
</PageShell>

<style>
	.roles {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin-bottom: 28px;
	}
	.rh {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 4px;
	}
	.rh-item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 8px 12px;
		background: var(--bg-s);
		border-radius: 7px;
		opacity: 0.65;
	}
	.rh-role {
		font-size: var(--text-sm);
		font-weight: 700;
		min-width: 90px;
	}
	.meta {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		margin-top: 24px;
		font-size: var(--text-xs);
	}
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
		.save-wrap :global(.sb) {
			width: 100%;
		}
	}
</style>
