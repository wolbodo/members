import { fail } from '@sveltejs/kit';

import { PersonByEmailStore } from '$houdini';
import { send } from '$lib/mail';

import { serverToken, createToken } from '$lib/jwt';
import type { Actions } from './$types';

export const actions = {
  default: async (event) => {
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
        id: person.id.toString()
      },
      {
        subject: 'password-reset',
        expiresIn: '30 minutes'
      }
    );

    console.log(`Reset mail: to ${person.name}(${email})`);
    send(event, person.id, 'password-reset', { token });
    return { success: true }

  }
} satisfies Actions;


