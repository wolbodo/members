<script lang='ts'>
  import { session } from '$app/stores';
  import { Input } from '$lib/Form'
  import { getPermissions } from './permissions';

  export let person

  export let fieldSet: string[][] = [
    [ 'name', ],
    [ 'firstname', 'lastname', 'email', 'phone'],
    [ 'address', 'city', 'country'],
    [ 'bankaccount', 'key_code'],
    [ 'id', 'created', 'modified', 'password', 'note']
  ]
  $: permissions = getPermissions($session.user?.roles)

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

  $: fieldInfo = fieldSet
                  .map(fields =>
                    fields.filter(field => permissions.view.includes(field))
                      .map(name => {
                        const field = {
                          name,
                          readonly: true,
                          value: person && person[name],
                          ...fieldOptions[name]
                        }
                        if (permissions.edit.includes(name)) {
                          delete field.readonly
                        }
                        return field
                      })
                  )
                  .filter(fields => fields.length)
</script>

  {#each fieldInfo as group }
    <section>
      {#each group as input}
        <Input {...input} />
      {/each}
    </section>
    
  {/each}

  <style>

  section {
    display: grid;
    grid-template-columns: repeat(2,auto);
    grid-column-gap: 1rem;
  }

  @media screen and (max-width: 500px) {
      section {
        grid-template-columns: auto;
      }
  }
  </style>