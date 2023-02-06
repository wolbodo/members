import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

import { GetPasswordStore } from '$houdini';

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

export const actions = {
	login: async (event) => {
		const data = await event.request.formData();
		const name = data.get('name');
		const password = data.get('password');

		const token = serverToken('login');
		const store = new GetPasswordStore();
		const {
			data: {
				auth_person: [person]
			}
		} = await store.fetch({
			event,
			variables: { name },
			metadata: { token }
		});

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

				event.cookies.set('token', user.token, { secure: false });
				throw redirect(302, '/');
			}
		}

		return fail(400, { name, incorrect: true });
	},
	logout: async (event) => {
		event.cookies.delete('token', { secure: false });

		throw redirect(302, '/');
	}
} satisfies Actions;
