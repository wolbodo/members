<script lang='ts'>
  import { getContext } from 'svelte'
  import { DateTime, Settings } from 'luxon'
  import { client, gql } from '$lib/graphql'

  Settings.defaultLocale = 'nl'

  export let name
  export let readonly
  export let value = []
  export let options = []

  const person = getContext('person')

  let newRoleName = ''
  $: currentRoles = value
    ? value.filter(({ valid_till }) => !valid_till)
           .sort(({ valid_from: a }, { valid_from: b}) => b - a)
    : []
  $: pastRoles = value
    ? value.filter(({ valid_till }) => valid_till)
           .sort(({ valid_from: a }, { valid_from: b}) => b - a)
    : []

  const stopRole = async (roleId) => {
    const { stoppedRole: { valid_till } } = await client.request(gql`
      mutation stopRole($roleId:Int!) {
        stoppedRole: update_auth_person_role_by_pk(pk_columns:{id:$roleId}, _set:{
          valid_till: "NOW()"
        }) {
          id valid_from valid_till
        }
      }`, { roleId }, { 'X-Hasura-Role': 'board' })

      const role = value.find(({ id }) => id === roleId)
      role.valid_till = valid_till

      value = value
  }

  const createRole = async (personId, role) => {
    const response = await client.request(gql`
      mutation createRole($personId:Int!, $role:String!) {
        newRole: insert_auth_person_role_one(object:{
          person_id:$personId,
          role:$role
        }) {
          id person_id role valid_from valid_till
        }
      }`, { personId, role }, { 'X-Hasura-Role': 'board' })
    const { newRole } = response
    value = [...value, newRole]
  }

  const submitForm = e => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Stopped form", newRoleName)

    createRole(person.id, newRoleName.toLowerCase())
    newRoleName = ''

  }
</script>


<form on:submit={submitForm}>
  {#if !readonly}
    <section>
      <input type='text' bind:value={newRoleName} placeholder='type to add a role'/>
      
      {#if newRoleName}
        <ul class='options'>
          {#each options.filter(opt => !currentRoles.map(({ role }) => role).includes(opt) && opt.match(newRoleName)) as option}
            <li>
              <button type='button' on:click={(e) => { newRoleName = option; submitForm(e) }}>
                {option}
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  {/if}
</form>

  {#if value}
    <ul class='roles'>
      {#each currentRoles as role}
        <li>
          <span>{role.role} since {DateTime.fromISO(role.valid_from).toLocaleString()}</span>

          {#if !readonly}
            <button type='button' on:click={() => stopRole(role.id)}>Stop</button>
          {/if}
        </li>
      {:else}
        <li>No current roles</li>
      {/each}
      {#if pastRoles.length}
        <li>Past roles:</li>
        {#each pastRoles as { role, valid_from, valid_till }}
          <li>
            <span>{role}</span>

            <span>from {DateTime.fromISO(valid_from).toLocaleString()} until {DateTime.fromISO(valid_till).toLocaleString()}</span>
          </li>
        {/each}
      {/if}
    </ul>
  {/if}


<style>
  .options {
    margin: 0;
    padding: 0.5rem;
    list-style: none;
    background: white;
  }

  .roles {
    padding: 0;
  }
  .roles li {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>