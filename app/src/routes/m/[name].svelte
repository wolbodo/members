<script context="module" lang="ts">
  import { client, gql } from '$lib/graphql';
  import { getPermissions } from '$lib/permissions'

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
    const isBoard = session.user.roles.includes('board')
    const fields = getPermissions(session.user.roles)
    // const allFields = isBoard ? [...FIELDS, ...BOARD_FIELDS] : FIELDS
    console.log('Doing query:',session.user )
    
    const { person: [person] } =  await client.request(gql`
        query getPerson($name:String) {
          person: auth_person(where:{name:{_ilike:$name}}, limit:1) {
            ${fields.view.filter(p => p!='roles').join(' ')}
            roles {
              role valid_from valid_till
            }
          }
        }
      `,
      { name: page.params.name}, 
      { 'X-Hasura-Role': isBoard ? 'board' : 'member' }
    )
    
    return {
      props: {
        person
      }
    }
	}
</script>

<script lang="ts">
  import { Person } from '$lib/Person'
  
  import { session } from '$app/stores';
  import { goto } from '$app/navigation';

  $: permissions = getPermissions($session.user?.roles)

  export let person: object
</script>

<content>

  <Person {person}
    mutation={gql`
      mutation updatePerson($id:Int!, $formdata:auth_person_set_input) {
        person: update_auth_person_by_pk(pk_columns:{id:$id} _set:$formdata) {
          ${permissions.edit.filter(p => p!='roles').join(' ')}
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