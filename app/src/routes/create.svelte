<script lang="ts">
import type { GraphQLClient } from "graphql-request";
  import { gql } from '$lib/graphql'
  import { Input, mutation } from '$lib/Form'

  let error
</script>

<form use:mutation={{
  role: 'board',
  mutation: gql`
    mutation addPerson($formdata:auth_person_insert_input!) {
      insert_auth_person_one(object:$formdata) {
        id
      }
  }`
}}>
  <section>
    <Input class='wide' name={'name'} label={'Name'} />
  </section>

  <section>
    <Input name='firstname' label='firstname' />
    <Input name='lastname' label='lastname' />

    <Input name='email' label='email' />
    <Input name='phone' label='phone'/>
  </section>
  
  <section>
    <Input name='address' label='address' />
    <Input name='city' label='city' />
    <Input name='country' label='country' />
  </section>
    
  <section>
    <Input name='bankaccount' label='bankaccount' />
    <Input name='key_code' label='key_code' />
  </section>
    
  <section>
    <Input name='id' label='id' />
    <Input name='created' label='created' />
    <Input name='modified' label='modified' />
    <Input name='password' label='password' />
    <Input name='note' label='note' />
  </section>

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

  section {
    display: grid;
    grid-template-columns: repeat(2,auto);
  }

  .wide {
    width: 100%;
  }
</style>