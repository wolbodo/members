<script lang="ts">
	import type { PageData } from './$houdini';
	import { datetime } from '$lib/format';
	import { Input, RoleSelector } from '$lib/Form';
	import { enhance } from '$app/forms';

	export let data: PageData;

	$: ({ PersonForEdit, user } = data);
	$: isBoard = user?.roles.includes('board');
	$: isSelf = parseInt(user.id) === $PersonForEdit.data?.auth_person[0].id;

	let edit: boolean;
</script>

<content>
	{#if $PersonForEdit.fetching}
		<p>Loading...</p>
	{:else if $PersonForEdit.errors}
		<h2>Error</h2>
		<ul>
			{#each $PersonForEdit.errors as error}
				<li>{error.message}</li>
			{/each}
		</ul>
	{:else if $PersonForEdit.data}
		{@const person = $PersonForEdit.data.auth_person[0]}

		<form action="?/edit" method="POST" use:enhance>
			{#if isBoard || isSelf}
				<button type="button" class:edit class="icon" on:click={() => (edit = !edit)}>
					{edit ? 'close' : 'mode_edit'}
				</button>
			{/if}

			<Input name="name" value={person.name} class="wide" readOnly={!edit || !isBoard} required />
			<Input name="firstname" value={person.firstname} readOnly={!edit} />
			<Input name="lastname" value={person.lastname} readOnly={!edit} />
			<Input name="email" value={person.email} type="email" readOnly={!edit} required />
			<Input name="phone" value={person.phone} type="phone" readOnly={!edit} />

			<Input name="address" value={person.address} readOnly={!edit} />
			<Input name="zipcode" value={person.zipcode} readOnly={!edit} />
			<Input name="city" value={person.city} readOnly={!edit} />
			<Input name="country" value={person.country} readOnly={!edit} />

			<Input name="bankaccount" value={person.bankaccount} readOnly={!edit} />

			{#if isBoard}
				<Input label="keycode" name="key_code" value={person.key_code} readOnly={!edit} />
			{/if}

			<Input name="password" type="password" readOnly={!edit} />

			{#if isBoard}
				<Input name="note" value={person.note} type="textarea" readOnly={!edit} />
			{/if}

			<!-- <RoleSelector {person} refetch={() => refetch({ name, isBoard })} readOnly={!edit} /> -->
			<RoleSelector {person} readOnly={!edit || !isBoard} refetch={() => PersonForEdit.fetch()} />

			<section>
				<Input name="id" value={person.id} type="hidden" readOnly />

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
		<p>No data</p>
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
	pre {
		height: 10rem;
		overflow: auto;
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
