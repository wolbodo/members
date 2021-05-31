<script context="module">
  import { client, gql } from '$lib/graphql'
  
  const FIELDS = [
    'name',
    'firstname', 'lastname', 'email',
    'phone', 'address', 'city', 'country',
    'note', 
    'id', 'created', 'modified',
  ]
  const BOARD_FIELDS = [
    'bankaccount', 'key_code', 'password',
  ]

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
    const isBoard = session.user.roles.includes('board')
    const allFields = isBoard ? [...FIELDS, ...BOARD_FIELDS] : FIELDS
    const { person: [person] } =  await client.request(gql`
        query getPerson($name:String) {
          person: auth_person(where:{name:{_ilike:$name}}, limit:1) {
            ${allFields.join(' ')}
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
  import { mutation } from "$lib/Form"
  import { session } from '$app/stores';
  import Person from '$lib/Person.svelte'

  let error

  $: isBoard = $session.user.roles.includes('board')
  $: allFields = isBoard ? [...FIELDS, ...BOARD_FIELDS] : FIELDS

  export let person: object
</script>

<form use:mutation={{
  role: 'board',
  mutation: gql`
    mutation updatePerson($id:Int!, $formdata:auth_person_set_input) {
      person: update_auth_person_by_pk(pk_columns:{id:$id} _set:$formdata) {
        ${allFields.join(' ')}
      }
    }
  `,
  variables: {
    id: person.id
  },
  error: (_, err) => error = err.toString(),
  result: ({ person: _person }) => person = _person
}}>
  <Person {person}/>

  {#if error}
    <small>{error}</small>
  {/if}

  <button type='submit'>Submit</button>
</form>

<style>
  form {
    display: grid;

    grid-template-columns: auto auto;
    grid-gap: 1rem;
  }


  button, small {
    grid-column: 1/3;
  }
</style>