<script lang="ts">
	import type { PageData } from './$houdini';
	import { datetime } from '$lib/format';
	import { Input, RoleSelector } from '$lib/Form';
	import { enhance } from '$app/forms';
	import Toggle from '$lib/Toggle.svelte';

	export let data: PageData;

	$: ({ Person, user } = data);
	$: isBoard = user?.roles.includes('board');
	$: isSelf = parseInt(user.id) === $Person.data?.auth_person[0]?.id;

	let edit: boolean;
</script>

<content>
	{#if $Person.fetching}
		<p>Loading...</p>
	{:else if $Person.errors}
		<h2>Error</h2>
		<ul>
			{#each $Person.errors as error}
				<li>{error.message}</li>
			{/each}
		</ul>
	{:else if $Person.data?.auth_person?.length}
		{@const person = $Person.data.auth_person[0]}

		<form
			action="?/edit"
			method="POST"
			use:enhance={() => {
				return async ({ result, update }) => {
					update();

					if (result.type === 'success') edit = false;
				};
			}}
		>
			{#if isBoard || isSelf}
				<button type="button" class:edit class="icon" on:click={() => (edit = !edit)}>
					{edit ? 'close' : 'mode_edit'}
				</button>
			{/if}

			<Input name="name" value={person.name} class="wide" readonly={!edit || !isBoard} required />
			<Input name="firstname" value={person.firstname} readonly={!edit} />
			<Input name="lastname" value={person.lastname} readonly={!edit} />
			<Input name="email" value={person.email} type="email" readonly={!edit} required />
			<Input name="phone" value={person.phone} type="phone" readonly={!edit} />

			<Input name="address" value={person.address} readonly={!edit} />
			<Input name="zipcode" value={person.zipcode} readonly={!edit} />
			<Input name="city" value={person.city} readonly={!edit} />
			<Input name="country" value={person.country} readonly={!edit} />

			<Input name="bankaccount" value={person.bankaccount} readonly={!edit} />

			{#if isBoard}
				<Input label="keycode" name="key_code" value={person.key_code} readonly={!edit} />
			{/if}

			<section>
				<Toggle name="allow_register" checked={Boolean(person.allow_register)} readonly={!edit}
					>allow register</Toggle
				>
				<Toggle name="allow_door" checked={Boolean(person.allow_door)} readonly={!edit}
					>allow door</Toggle
				>
			</section>
			<Input name="password" type="password" readonly={!edit} />

			{#if isBoard}
				<Input name="note" value={person.note} type="textarea" readonly={!edit} />
			{/if}

			<!-- <RoleSelector {person} refetch={() => refetch({ name, isBoard })} readonly={!edit} /> -->
			<RoleSelector {person} readonly={!edit || !isBoard} refetch={() => Person.fetch()} />

			<section>
				<Input name="id" value={person.id} type="hidden" readonly />

				<b>#{person.id}</b>
				<p>created:{datetime(person.created)}</p>
				<p>modified:{datetime(person.modified)}</p>
			</section>

			{#if edit}
				<section class="submit">
					<!-- {#if error}
							{#each error as error}
								<small>{error.message}</small>
							{/each}
						{/if} -->
					<button type="submit">Submit</button>
				</section>
			{/if}
		</form>
	{:else}
		<h2>Person not found</h2>
	{/if}
</content>

<style>
	button.icon {
		font-size: 1.5rem;
		padding: 0 0.5rem;

		grid-column-start: 2;
		justify-self: end;
		width: 3rem;
		height: 3rem;
	}
	button.edit {
		background-color: var(--danger-3);
	}
	form {
		display: grid;

		grid-template-columns: 1fr 1fr;
		grid-gap: 0.5rem 1rem;
	}
	form :global(.wide) {
		grid-column: span 2;
	}

	.submit {
		display: grid;
		grid-template-areas: 'error submit';
		grid-column: span 2;
	}
	.submit > button {
		grid-area: submit;
		justify-self: end;
	}
</style>
