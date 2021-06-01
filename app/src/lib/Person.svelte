<script lang='ts'>

  import { session } from '$app/stores';
  import { Input } from '$lib/Form'
  import { Role, getPermissions } from './permissions';

  export let person

  export let fieldSet: string[][] = [
    [ 'name', ],
    [ 'firstname', 'lastname', 'email', 'phone'],
    [ 'address', 'city', 'country'],
    [ 'bankaccount', 'key_code'],
    [ 'roles',],
    ['password'],
    [ 'note'],
    [ 'created', 'modified', 'id' ],
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
      label: 'Password',
      type: 'password'
    },
    note: {
      label: 'Note',
      type: 'textarea'
    },
    roles: {
      label: 'Roles',
      type: 'multiselect',
      options: Object.keys(Role)
    }
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
                        if (name === 'roles') {
                          field.value = field.value?.map(({ role }) => role);
                        }
                        return field
                      })
                  )
                  .filter(fields => fields.length)

</script>

  {#each fieldInfo as group }
    <section class='grid'>
      {#each group as input}
        <Input {...input} />
      {/each}
    </section>
  {/each}

<style>

  section {
    min-width: 600px;

    display: grid;
    grid-template-columns: repeat(2,auto);
    grid-column-gap: 1rem;
  }

  section.roles {
    display: block;
  }
  .roles label {
    display: inline;
    margin: 0;
    padding: 0;
  }
  .roles input {
    width: auto;
  }

  @media screen and (max-width: 500px) {
      section {
        grid-template-columns: auto;
      }
  }
  </style>