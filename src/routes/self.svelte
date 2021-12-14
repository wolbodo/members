<script lang="ts" context="module">
	export function GetSelfForEditVariables({ session }) {
		session.currentRole = 'self';

		return {
			id: session.user.id
		};
	}
</script>

<script lang="ts">
	import { query, mutation, graphql, EditPerson, GetSelfForEdit } from '$houdini';
	import { datetime } from '$lib/format';
	import { Input } from '$lib/Form';

	export let id;

	let form, error;

	const editPerson = mutation<EditPerson>(graphql`
		mutation EditSelf($id: Int!, $data: auth_person_set_input!) {
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
				}
			}
		}
	`);

	const { data } = query<GetSelfForEdit>(graphql`
		query GetSelfForEdit($id: Int!) {
			auth_person_by_pk(id: $id) {
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
			}
		}
	`);
	$: person = $data.auth_person_by_pk;

	const submit = async (e) => {
		e.preventDefault();

		const formData = new FormData(form);
		const entries = formData.entries();
		const data = Object.fromEntries(
			Array.from(entries).filter(([name, value]) => person[name] !== value)
		);

		try {
			await editPerson({ id: person.id, data });
		} catch (err) {
			error = err;
		}
	};
</script>

<content>
	<form on:submit={submit} bind:this={form}>
		<Input name="name" value={person.name} class="wide" required />
		<Input name="firstname" value={person.firstname} />
		<Input name="lastname" value={person.lastname} />
		<Input name="email" value={person.email} type="email" required />
		<Input name="phone" value={person.phone} type="phone" />

		<Input name="address" value={person.address} readOnly={!edit} />
		<Input name="zipcode" value={person.zipcode} readOnly={!edit} />
		<Input name="city" value={person.city} readOnly={!edit} />
		<Input name="country" value={person.country} readOnly={!edit} />

		<Input name="bankaccount" value={person.bankaccount} />

		<!-- <Input name="roles" value={person.roles} /> -->
		<Input name="password" type="password" value={person.password} />
		<Input name="note" value={person.note} type="textarea" />

		<section class="wide">
			<b>#{person.id}</b>
			<p>created:{datetime(person.created)}</p>
			<p>modified:{datetime(person.modified)}</p>
		</section>

		<section class="submit">
			{#if error}
				{#each error as error}
					<small>{error.message}</small>
				{/each}
			{/if}
			<button type="submit">Submit</button>
		</section>
	</form>
</content>

<style>
	button.icon {
		font-size: 1.5rem;
		padding: 0 0.5rem;

		grid-column-start: 2;
		justify-self: end;
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
