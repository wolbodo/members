<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { Input } from '$lib/Form';

	export let form: ActionData;
</script>

<content>
	{#if form?.errors}
		{#each form?.errors as error}
			<small class="error">{error.message}</small>
		{/each}
	{/if}

	{#if form?.data}
		<!-- this message is ephemeral; it exists because the page was rendered in       response to a form submission. it will vanish if the user reloads -->
		<p>Successfully created user, {form?.data?.person?.name}</p>
	{:else}
		<form method="POST" use:enhance>
			<Input name="name" value={form?.variables?.person.name || ''} class="wide" required />
			<Input name="firstname" value={form?.variables?.person.firstname || ''} />
			<Input name="lastname" value={form?.variables?.person.lastname || ''} />
			<Input name="email" value={form?.variables?.person.email || ''} type="email" required />
			<Input name="phone" value={form?.variables?.person.phone || ''} type="phone" />

			<Input name="address" value={form?.variables?.person.address || ''} />
			<Input name="zipcode" value={form?.variables?.person.zipcode || ''} />
			<Input name="city" value={form?.variables?.person.city || ''} />
			<Input name="country" value={form?.variables?.person.country || ''} />

			<Input name="bankaccount" value={form?.variables?.person.bankaccount || ''} />
			<Input label="keycode" name="key_code" value={form?.variables?.person.key_code || ''} />
			<Input
				type="checkbox"
				label="allow register"
				name="allow_register"
				value={form?.variables?.person.allow_register || false}
			/>
			<Input
				type="checkbox"
				label="allow door"
				name="allow_door"
				value={form?.variables?.person.allow_door || false}
			/>

			<Input name="password" value={form?.variables?.person.password || ''} type="password" />
			<Input name="note" value={form?.variables?.person.note || ''} type="textarea" />

			<section class="submit">
				<button type="submit">Submit</button>
			</section>
		</form>
	{/if}
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
		grid-template-areas: 'submit';
		grid-column: span 2;
	}
	.submit > button {
		grid-area: submit;
		justify-self: end;
	}
</style>
