<script lang="ts">
  import { gql } from '$lib/graphql'
  import { Person } from '$lib/Person'
</script>

<Person mutation={gql`
  mutation addPerson($formdata:auth_person_insert_input!) {
    insert_auth_person_one(object:$formdata) {
      id
    }
}`}/>

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  button {
    background: var(--accent-color);
  }
</style>