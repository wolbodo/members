import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

import { GetPasswordStore } from '$houdini';

import { serverToken, createToken } from '$lib/jwt';
import type { Actions } from './$types';

import { options as tokenCookieOptions } from '../cookieOptions'

// These are the only roles passed to the token, and in this order.
const ALL_ROLES = ['member', 'board', 'admin', 'self'] as const;


export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const name = data.get('name') as string;
    const password = data.get('password') as string;

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

        // Redirect to what the redirect param states if it's from the wolbodo domain.
        const location = data.has('redirect') && new URL(data.get('redirect') as string).host.endsWith('wolbodo.nl')
          ? data.get('redirect') : '/'

        event.cookies.set('token', user.token, tokenCookieOptions);
        throw redirect(302, location);
      }
    }

    return fail(400, { name, incorrect: true });
  },
} satisfies Actions;
