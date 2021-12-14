<script lang="ts" context="module">
	export function onLoad({ page, session }) {
		return {
			name: page.params.name,
			isBoard: session.user.roles.includes('board')
		};
	}
	export function GetPersonForEditVariables({ page, session }) {
		const { params } = page;
		const isBoard = session.user.roles.includes('board');
		session.currentRole = isBoard ? 'board' : 'member';

		return {
			name: params.name,
			isBoard
		};
	}
</script>

<script lang="ts">
	import { query, mutation, graphql, EditPerson, GetPersonForEdit } from '$houdini';
	import { datetime } from '$lib/format';
	import { Input, RoleSelector } from '$lib/Form';

	export let name;
	export let isBoard = false;

	let form, edit, error;

	const editPerson = mutation<EditPerson>(graphql`
		mutation EditPerson($id: Int!, $data: auth_person_set_input!) {
			person: update_auth_person(where: { id: { _eq: $id } }, _set: $data) {
				returning {
					name
					firstname
					lastname
					email
					phone
					address
					zipcode
					city
					country
					note
					id
					created
					modified

					bankaccount
					key_code
				}
			}
		}
	`);

	const { data, refetch } = query<GetPersonForEdit>(graphql`
		query GetPersonForEdit($name: String, $isBoard: Boolean = false) {
			auth_person(where: { name: { _ilike: $name } }, limit: 1) {
				name
				firstname
				lastname
				email
				phone
				address
				zipcode
				city
				country
				note
				id
				created
				modified
				...RoleSelector

				bankaccount @include(if: $isBoard)
				key_code @include(if: $isBoard)
			}
		}
	`);
	$: [person] = $data.auth_person;

	const submit = async (e) => {
		e.preventDefault();

		const formData = new FormData(form);
		const entries = formData.entries();
		const data = Object.fromEntries(
			Array.from(entries).filter(([name, value]) => person[name] !== value)
		);
		console.log('Should update person', formData, Array.from(entries), data);

		try {
			const result = await editPerson({ id: person.id, data });
			console.log('Added', data, 'got', result);
			edit = false;
		} catch (err) {
			error = err;
			console.log('err', err);
		}
	};
</script>

<content>
	<form on:submit={submit} bind:this={form}>
		{#if isBoard}
			<button type="button" class:edit class="icon" on:click={() => (edit = !edit)}>
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

		<RoleSelector
			personId={person.id}
			roles={person.roles}
			refetch={() => refetch({ name, isBoard })}
			readOnly={!edit}
		/>

		<section>
			<b>#{person.id}</b>
			<p>created:{datetime(person.created)}</p>
			<p>modified:{datetime(person.modified)}</p>
		</section>

		{#if edit}
			<section class="submit">
				{#if error}
					{#each error as error}
						<small>{error.message}</small>
					{/each}
				{/if}
				<button type="submit">Submit</button>
			</section>
		{/if}
	</form>
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
