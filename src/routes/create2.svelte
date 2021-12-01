<script lang="ts" context="module">
	export function GetPersonVariables() {
		return {};
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { query, mutation, graphql, GetPerson, AddPerson } from '$houdini';

	import { browser } from '$app/env';
	import { session } from '$app/stores';

	import { Input } from '$lib/Form';

	export let toggle = false;

	let form, initialData;
	let error;

	onMount(() => {
		const roleOnMount = $session.currentRole;

		$session.currentRole = $session.user.roles.includes('board') ? 'board' : 'member';

		if (form) {
			initialData = Object.fromEntries(new FormData(form).entries());
		}
		console.log('initialData', initialData);
		return () => {
			$session.currentRole = roleOnMount;
		};
	});

	const addPerson = mutation<AddPerson>(graphql`
		mutation AddPerson($data: auth_person_insert_input!) {
			new_person: insert_auth_person_one(object: $data) {
				id
				name
			}
		}
	`);

	// load the items
	const { data, refetch } = query<GetPerson>(graphql`
		query GetPerson($where: auth_person_bool_exp = { id: { _eq: 1 } }, $toggle: Boolean = false) {
			auth_person(where: $where, limit: 1) {
				name
				email
				id @include(if: $toggle)
			}
		}
	`);

	const submit = async (e) => {
		const form = e.target;

		e.preventDefault();

		const body = new FormData(form);
		const data = Object.fromEntries(
			Array.from(body.entries()).filter(([name, value]) => initialData[name] !== value)
		);

		try {
			const result = await addPerson({ data });
			console.log('Added', data, 'got', result);
		} catch (err) {
			error = err;
			console.log('err', err);
		}
	};

	$: if (browser) refetch({ toggle });
</script>

<input type="checkbox" bind:checked={toggle} />

<pre>
    {JSON.stringify($data, null, 2)}
</pre>

<form on:submit={submit} bind:this={form}>
	<Input name="name" class="wide" />
	<Input name="firstname" />
	<Input name="lastname" />
	<Input name="email" />
	<Input name="phone" />

	<Input name="bankaccount" />
	<Input label="key code" name="key_code" />

	<Input name="roles" />
	<Input name="password" />
	<Input name="note" />

	<Input name="created" />
	<Input name="modified" />
	<Input name="id" />

	<section class="wide">
		{#if error}
			{#each error as error}
				<small>{error.message}</small>
			{/each}
		{/if}
		<button type="submit">Submit</button>
	</section>
</form>

<style>
	form {
		display: grid;

		grid-template-columns: 1fr 1fr;
		grid-gap: 0.5rem 1rem;
	}
	.wide {
		grid-column: span 2;
	}

	button {
		background: var(--accent-color);
	}
</style>
