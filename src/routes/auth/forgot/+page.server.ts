import { fail } from '@sveltejs/kit';
import { ilike } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { person } from '$lib/server/schema';
import { send } from '$lib/mail';
import { createToken } from '$lib/jwt';
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email') as string;

		if (!email) return fail(400, { error: 'Email is required' });

		const [found] = await db
			.select({ id: person.id, name: person.name })
			.from(person)
			.where(ilike(person.email, email))
			.limit(1);

		if (!found) {
			console.log(`Reset failed: email address '${email}' unknown`);
			return { success: true };
		}

		const token = createToken(
			{ id: found.id.toString() },
			{ subject: 'password-reset', expiresIn: '30 minutes' }
		);

		console.log(`Reset mail: to ${found.name}(${email})`);
		send(event, found.id, 'password-reset', { token });
		return { success: true };
	}
} satisfies Actions;
