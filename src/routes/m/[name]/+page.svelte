<!-- <script lang="ts" context="module">
	export function onLoad({ params, session }) {
		return {
			name: params.name,
			isBoard: session.user.roles.includes('board')
		};
	}
	export function GetPersonForEditVariables({ params, session }) {
		const isBoard = session.user.roles.includes('board');
		session.currentRole = isBoard ? 'board' : 'member';

		return {
			name: params.name,
			isBoard
		};
	}
</script> -->
<script lang="ts">
	import { query, mutation, graphql, EditPerson } from '$houdini';
	import type { PageData } from './$houdini';
	import { datetime } from '$lib/format';
	import { Input, RoleSelector } from '$lib/Form';

	export let data: PageData;
	export let name;

	$: ({ PersonForEdit, user } = data);
	$: isBoard = user?.roles.includes('board');

	let edit: boolean;
	// let form, edit, error;

	// const { data, refetch } = query<PersonForEdit>(graphql`

	// `);
	// $: [person] = $data.auth_person;
	// const hasPropertyChanged = ([name, value]): boolean =>	{
	// 	if (value === "") {
	// 		// If the property stays 'empty'
	// 		return !!person[name]
	// 	}
	// 	return person[name] !== value
	// }

	// const submit = async (e) => {
	// 	e.preventDefault();

	// 	const formData = new FormData(form);
	// 	const entries = formData.entries();
	// 	const data = Object.fromEntries(
	// 		Array.from(entries).filter(hasPropertyChanged)
	// 	);
	// 	console.log('Should update person', person, formData, Array.from(entries), data);

	// 	try {
	// 		const result = await editPerson({ id: person.id, data });
	// 		console.log('Added', data, 'got', result);
	// 		edit = false;
	// 	} catch (err) {
	// 		error = err;
	// 		console.log('err', err);
	// 	}
	// };
</script>

<content>
	{#if !$PersonForEdit.data}
		<p>Loading....</p>
	{:else}
		{@const person = $PersonForEdit.data.auth_person[0]}
		<form action="?/edit" method="POST">
			{#if isBoard}
				<button
					type="button"
					class:edit
					class="icon"
					on:click={(e) => {
						console.log('edit', edit);
						edit = !edit;
					}}
				>
					{edit ? 'close' : 'mode_edit'}
				</button>
			{/if}

			<Input name="name" value={person.name} class="wide" readOnly={!edit} required />
			<Input name="firstname" value={person.firstname} readOnly={!edit} />
			<Input name="lastname" value={person.lastname} readOnly={!edit} />
			<Input name="email" value={person.email} type="email" readOnly={!edit} required />
			<Input name="phone" value={person.phone} type="phone" readOnly={!edit} />

			<Input name="address" value={person.address} readOnly={!edit} />
			<Input name="zipcode" value={person.zipcode} readOnly={!edit} />
			<Input name="city" value={person.city} readOnly={!edit} />
			<Input name="country" value={person.country} readOnly={!edit} />

			<Input name="bankaccount" value={person.bankaccount} readOnly={!edit} />
			<Input label="keycode" name="key_code" value={person.key_code} readOnly={!edit} />

			<Input name="password" type="password" readOnly={!edit} />
			<Input name="note" value={person.note} type="textarea" readOnly={!edit} />

			<!-- <RoleSelector
				personId={person.id}
				roles={person.roles}
				refetch={() => refetch({ name, isBoard })}
				readOnly={!edit}
			/> -->

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
