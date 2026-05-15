<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LoginPage from '../../routes/auth/login/+page.svelte';

	const pageState = {
		url: new URL('http://localhost/auth/login'),
		params: {},
		route: { id: '/auth/login' },
		status: 200,
		error: null,
		data: {},
		state: {},
		form: null
	};

	const { Story } = defineMeta({
		title: 'Pages/Login',
		component: LoginPage,
		parameters: {
			layout: 'fullscreen',
			sveltekit_experimental: {
				state: { page: pageState },
				forms: { enhance: () => ({ destroy() {} }) }
			}
		}
	});
</script>

<Story name="Default" args={{ form: null }} />

<Story name="With error" args={{ form: { incorrect: true, name: 'dex' } }} />

<Story
	name="With redirect notice"
	args={{ form: null }}
	parameters={{
		sveltekit_experimental: {
			state: {
				page: {
					...pageState,
					url: new URL('http://localhost/auth/login?redirect=/m/klaas')
				}
			},
			forms: { enhance: () => ({ destroy() {} }) }
		}
	}}
/>
