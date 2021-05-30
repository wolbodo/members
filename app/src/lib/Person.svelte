<script lang='ts'>
  import { Input } from '$lib/Form'

  export let person

  export let fields: string[] = [
    'firstname', 'lastname',
    'email', 'phone',
    'address', 'city',
    'country', 'bankaccount',
    'key_code', 'id',
    'created', 'modified',
    'password', 'note'
  ]

  export let fieldSet: string[][] = [
    [ 'name', ],
    [ 'firstname', 'lastname', 'email', 'phone'],
    [ 'address', 'city', 'country'],
    [ 'bankaccount', 'key_code'],
    [ 'id', 'created', 'modified', 'password', 'note']
  ]

  const fieldOptions = {
    name: {
      label: 'Name',
      class: 'wide'
    },
    firstname: {
      label: 'Firstname',
    },
    lastname: {
      label: 'Lastname',
    },
    email: {
      label: 'Email',
      type: 'email'
    },
    phone: {
      label: 'Phone',
      type: 'tel'
    },
    address: {
      label: 'address'
    },
    city: {
      label: 'city'
    },
    country: {
      label: 'country'
    },
    bankaccount: {
      label: 'bankaccount'
    },
    key_code: {
      label: 'key_code'
    },
    id: {
      label: 'id',
      readonly: true
    },
    created: {
      label: 'created',
      readonly: true
    },
    modified: {
      label: 'modified',
      readonly: true
    },
    password: {
      label: 'password',
      type: 'password'
    },
    note: {
      label: 'note',
      type: 'textarea'
    },
  }
</script>

  {#each fieldSet as group }
    <section>
      <!-- {JSON.stringify(group)} -->
      {#each group as field}
        <Input name={field} {...fieldOptions[field]} value={person && person[field]} />
      {/each}
    </section>
    
  {/each}

  <style>

  section {
    display: grid;
    grid-template-columns: repeat(2,auto);
  }
  </style>