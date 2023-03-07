import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

import { GetPasswordStore, PersonByEmailStore } from '$houdini';
import { send } from '$lib/mail';

import { serverToken, createToken } from '$lib/jwt';
import type { Actions } from './$types';

// These are the only roles passed to the token, and in this order.
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || 'wolbodo.nl';
const ALL_ROLES = ['member', 'board', 'admin', 'self'] as const;

type User = {
	email: string;
	name: string;
	id: number;
	roles: (typeof ALL_ROLES)[number];
	token: string;
};

const tokenCookieOptions = { secure: false, path: '/' };

export const actions = {
	login: async (event) => {
		const data = await event.request.formData();
		const name = data.get('name');
		const password = data.get('password');

		const token = serverToken('login');
		const store = new GetPasswordStore();
		const result = await store.fetch({
			event,
			variables: { name },
			metadata: { token }
		});

		if (!result.data) {
			return fail(400, { name, incorrect: true });
		}
		const {
			auth_person: [person]
		} = result.data;

		if (person && person.password && person.roles.length) {
			const ok = await bcrypt.compare(password, person.password);

			if (ok) {
				// Remove the password else it will end up at the client.
				delete person.password;

				const roles = [...person.roles.map(({ role }) => role), 'self'];
				const user = {
					...person,
					roles: ALL_ROLES.filter((role) => roles.includes(role))
				};

				user.token = createToken(
					{
						...user,
						id: user.id.toString()
					},
					{
						subject: user.id.toString()
					}
				);

				event.cookies.set('token', user.token, tokenCookieOptions);
				throw redirect(302, '/');
			}
		}

		return fail(400, { name, incorrect: true });
	},
	logout: async (event) => {
		event.cookies.delete('token', tokenCookieOptions);

		throw redirect(302, '/');
	},
	forgot: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email');

		if (!email) {
			throw fail(400);
		}
		const store = new PersonByEmailStore();

		const result = await store.fetch({
			event,
			variables: { email },
			metadata: { token: serverToken('password-forgot') }
		});
		if (!result.data?.person[0]) {
			console.log(`Reset failed: email address '${email}' unknown`);
			return;
		}
		const {
			person: [person]
		} = result.data;
		const token = createToken(
			{
				id: person.id
			},
			{
				subject: 'password-reset',
				expiresIn: '30 minutes'
			}
		);

		console.log(`Reset mail: to ${person.name}(${email})`);
		send(person.id, 'password-reset', { token });
	}
} satisfies Actions;
