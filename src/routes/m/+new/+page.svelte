<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { Input } from '$lib/Form';
	import Toggle from '$lib/Toggle.svelte';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<content>
	{#if form?.errors}
		{#each form.errors as error}
			<small class="error">{error.message}</small>
		{/each}
	{/if}

	<form method="POST" use:enhance>
		<Input name="name" value="" class="wide" required />
		<Input name="firstname" value="" />
		<Input name="lastname" value="" />
		<Input name="email" value="" type="email" required />
		<Input name="phone" value="" type="phone" />

		<Input name="address" value="" />
		<Input name="zipcode" value="" />
		<Input name="city" value="" />
		<Input name="country" value="" />

		<Input name="bankaccount" value="" />
		<Input label="keycode" name="key_code" value="" />
		<Toggle name="allow_register" checked={false}>allow register</Toggle>
		<Toggle name="allow_door" checked={false}>allow door</Toggle>

		<Input name="password" value="" type="password" />
		<Input name="note" value="" type="textarea" />

		<section class="submit">
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
		grid-template-areas: 'submit';
		grid-column: span 2;
	}
	.submit > button {
		grid-area: submit;
		justify-self: end;
	}
</style>
