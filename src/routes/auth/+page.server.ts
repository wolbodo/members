import { redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

import { options as tokenCookieOptions } from './cookieOptions'

export const actions = {
	logout: async (event) => {
		event.cookies.delete('token', tokenCookieOptions);

		throw redirect(302, '/');
	},
} satisfies Actions;
