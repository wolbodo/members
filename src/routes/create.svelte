<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { getPermissions } from '$lib/permissions';

	import Detail from '$lib/Person/Detail.svelte';

	$: permissions = getPermissions($session.user?.roles);
</script>

<Detail
	{permissions}
	on:save={({ detail: { new_person } }) => goto(`/m/${new_person.name.toLowerCase()}`)}
	mutation={gql`
		mutation addPerson($formdata: auth_person_insert_input!) {
			new_person: insert_auth_person_one(object: $formdata) {
				id
				name
			}
		}
	`}
/>

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
