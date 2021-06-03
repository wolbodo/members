<script lang='ts'>
  import { onMount } from 'svelte'
  import { session } from '$app/stores';
  import { client, gql } from '$lib/graphql'
  import { Input, RoleSelector, mutation as gqlMutation } from '$lib/Form'
  import { getPermissions } from '$lib/permissions';

  let error
  export let mutation, variables
  export let person
  let roles

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

  onMount(async () => {
    const data =  await client.request(gql`
        query getRoles {
          roles: auth_person_role(distinct_on:role) {
            role
          }
        }
      `
    )
    roles = data.roles.map(({ role }) => role)
  })

  $: permissions = getPermissions($session.user?.roles)

  $: fieldOptions = {
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
      type: RoleSelector,
      options: roles
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
                        return field
                      })
                  )
                  .filter(fields => fields.length)

</script>

<form use:gqlMutation={{
  role: 'board',
  mutation, variables,
  error: (_, err) => error = err.toString(),
  result: data => console.log('created', data)
}}>

  {#each fieldInfo as group }
    <section class='grid'>
      {#each group as input}
        <Input {...input} />
      {/each}
    </section>
  {/each}

  {#if error}
    <small>{error}</small>
  {/if}

  {#if permissions.edit.length}
    <button type='submit'>Submit</button>
  {/if}
</form>

<style>

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  button {
    background: var(--accent-color);
  }

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