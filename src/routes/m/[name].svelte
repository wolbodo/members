<script context="module" lang="ts">
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
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import Detail from '$lib/Person/Detail.svelte';

	import { session } from '$app/stores';
	import { goto } from '$app/navigation';

	$: isSelf = person.id === parseInt($session.user.id);
	$: validRoles = $session.user?.roles.filter((role) => (role === 'self' ? isSelf : true));
	$: permissions = getPermissions(validRoles);
	$: role = ['board', 'self', 'member'].find((option) => validRoles.includes(option));

	export let person: object;

	setContext('person', person);
</script>

<content>
	<Detail
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
	/>
</content>

<style>
</style>
