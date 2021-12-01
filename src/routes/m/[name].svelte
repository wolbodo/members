<!-- <script context="module" lang="ts">
	import { getPermissions } from '$lib/permissions';

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, session }) {
		// Query id for resolving roles and permissions

		const {
			person: [{ id }]
		} = await client.request(
			gql`
				query getPerson($name: String) {
					person: auth_person(where: { name: { _ilike: $name } }, limit: 1) {
						id
					}
				}
			`,
			{ name: page.params.name }
		);

		const isSelf = id === parseInt(session.user.id);
		const validRoles = session.user.roles.filter((role) => (role === 'self' ? isSelf : true));
		const role = ['board', 'self', 'member'].find((option) => validRoles.includes(option));

		const {
			person: [person]
		} = await client.request(
			gql`
        query getPerson($name:String) {
          person: auth_person(where:{name:{_ilike:$name}}, limit:1) {
            ${getPermissions(validRoles)
							.view.filter((p) => p != 'roles')
							.join(' ')}
            roles {
              id role valid_from valid_till
            }
          }
        }
      `,
			{ name: page.params.name },
			{ 'X-Hasura-Role': role }
		);

		return {
			props: {
				person
			}
		};
	}
</script> -->
<script lang="ts" context="module">
	export function onLoad({ page, session }) {
		return {
			isSelf: session.user?.name.toLowerCase() === page.params.name.toLowerCase()
		};
	}
	export function GetPersonForEditVariables({ page, session }) {
		const { params } = page;
		session.currentRole = session.user.roles.includes('board') ? 'board' : 'member';

		return {
			name: params.name,
			isSelf: session.user?.name.toLowerCase() === params.name.toLowerCase()
		};
	}
</script>

<script lang="ts">
	import { slide } from 'svelte/transition';

	import { query, mutation, graphql, EditPerson, GetPersonForEdit } from '$houdini';
	import { datetime } from '$lib/format';
	import { Input } from '$lib/Form';

	import { session } from '$app/stores';
	import { goto } from '$app/navigation';

	export let isSelf = false;

	let form,
		edit = true,
		error;

	const editPerson = mutation<EditPerson>(graphql`
		mutation EditPerson($id: Int!, $data: auth_person_set_input!) {
			person: update_auth_person(where: { id: { _eq: $id } }, _set: $data) {
				returning {
					id
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
					modified
				}
			}
		}
	`);

	const { data, refetch } = query<GetPersonForEdit>(graphql`
		query GetPersonForEdit($name: String, $isSelf: Boolean = false) {
			person: auth_person(where: { name: { _ilike: $name } }, limit: 1) {
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
				roles {
					id
					role
					valid_from
					valid_till
				}
				bankaccount @include(if: $isSelf)
			}
		}
	`);
	$: [person] = $data.person;

	const submit = async (e) => {
		e.preventDefault();

		const formData = new FormData(form);
		const entries = formData.entries();
		const data = Object.fromEntries(
			Array.from(entries).filter(([name, value]) => person[name] !== value)
		);
		console.log('Should update person', formData, Array.from(entries), data);
		debugger;

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
		<button type="button" class:edit class="icon" on:click={() => (edit = !edit)}>
			{edit ? 'close' : 'mode_edit'}
		</button>

		<Input name="name" value={person.name} class="wide" readonly={!edit} />
		<Input name="firstname" value={person.firstname} readonly={!edit} />
		<Input name="lastname" value={person.lastname} readonly={!edit} />
		<Input name="email" value={person.email} type="email" readonly={!edit} />
		<Input name="phone" value={person.phone} type="phone" readonly={!edit} />

		<Input name="bankaccount" value={person.bankaccount} readonly={!edit} />
		<Input label="keycode" name="key_code" value={person.key} readonly={!edit} />

		<!-- <Input name="roles" value={person.roles} /> -->
		<Input name="password" value={person.password} readonly={!edit} />
		<Input name="note" value={person.note} type="textarea" readonly={!edit} />

		<section>
			<b>#{person.id}</b>
			<p>created:{datetime(person.created)}</p>
			<p>modified:{datetime(person.modified)}</p>
		</section>

		{#if edit}
			<section class="submit" transition:slide>
				{#if error}
					{#each error as error}
						<small>{error.message}</small>
					{/each}
				{/if}
				<button type="submit">Submit</button>
			</section>
		{/if}
	</form>

	<!-- <Detail
		on:save={(data) => goto('/')}
		{person}
		{permissions}
		{role}
		mutation={gql`
      mutation updatePerson($id:Int!, $formdata:auth_person_set_input) {
        person: update_auth_person_by_pk(pk_columns:{id:$id} _set:$formdata) {
          ${permissions.edit.filter((p) => p != 'roles').join(' ')}
        }
      }
    `}
		variables={{
			id: person.id
		}}
		result={({ person: _person }) => goto('/')}
	/> -->
</content>

<style>
	button.icon {
		font-size: 1.5rem;
		padding: 0 0.5rem;

		grid-column-start: 2;
		justify-self: end;
	}
	button.edit {
		background-color: var(--accent-color);
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
