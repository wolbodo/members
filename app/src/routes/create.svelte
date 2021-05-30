<script lang="ts">
  import { gql } from '$lib/graphql'
  import { mutation } from '$lib/Form'
  import Person from '$lib/Person.svelte'

  let error
</script>

<form use:mutation={{
  role: 'board',
  mutation: gql`
    mutation addPerson($formdata:auth_person_insert_input!) {
      insert_auth_person_one(object:$formdata) {
        id
      }
  }`,
  error: (_, err) => error = err.toString(),
  result: data => console.log('created', data)
}}>

  <Person />

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