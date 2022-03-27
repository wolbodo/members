<script lang="ts" context="module">
	export function load({ session }) {
		session.currentRole = 'board';
		console.log('Set', session);
		return {};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { mutation, graphql, CreatePerson } from '$houdini';
	import { Input } from '$lib/Form';

	let form, error;

	const createPerson = mutation<CreatePerson>(graphql`
		mutation CreatePerson($person: auth_person_insert_input!) {
			person: insert_auth_person_one(object: $person) {
				id
				name
			}
		}
	`);

	const submit = async (e) => {
		e.preventDefault();

		const formData = new FormData(form);
		const person = Object.fromEntries(formData.entries());
		console.log('Should update person', formData, person);

		try {
			const result = await createPerson({ person });
			console.log('Added', person, 'got', result);

			goto(`/m/${result.person.name}`);
		} catch (err) {
			console.log('err', err);
			error = err;
		}
	};
</script>

<content>
	<form on:submit={submit} bind:this={form}>
		<Input name="name" class="wide" required />
		<Input name="firstname" />
		<Input name="lastname" />
		<Input name="email" type="email" required />
		<Input name="phone" type="phone" />

		<Input name="address" />
		<Input name="zipcode" />
		<Input name="city" />
		<Input name="country" />

		<Input name="bankaccount" />
		<Input label="keycode" name="key_code" />

		<Input name="password" type="password" />
		<Input name="note" type="textarea" />

		<section class="submit">
			{#if error}
				{#each error as error}
					<small>{error.message}</small>
				{/each}
			{/if}
			<button type="submit">Submit</button>
		</section>
	</form>
</content>

<style>
	form {
		display: grid;

		grid-template-columns: 1fr 1fr;
		grid-gap: 0.5rem 1rem;
	}
	form :global(.wide) {
		grid-column: span 2;
	}

	.submit {
		display: grid;
		grid-template-areas: 'error submit';
		grid-column: span 2;
	}
	.submit > button {
		grid-area: submit;
		justify-self: end;
	}
</style>
