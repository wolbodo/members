import { fail } from '@sveltejs/kit';
import { ilike } from 'drizzle-orm';
import { createHash } from 'node:crypto';

import { db } from '$lib/server/db';
import { person } from '$lib/server/schema';
import { send } from '$lib/mail';
import { createToken } from '$lib/jwt';
import type { Actions } from './$types';

const pwhFingerprint = (hash: string | null | undefined): string =>
	createHash('sha256')
		.update(hash ?? '')
		.digest('hex')
		.slice(0, 16);

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email') as string;

		if (!email) return fail(400, { error: 'Email is required' });

		const [found] = await db
			.select({ id: person.id, password: person.password })
			.from(person)
			.where(ilike(person.email, email))
			.limit(1);

		if (!found) return { success: true };

		const token = createToken(
			{ id: found.id.toString(), pwh: pwhFingerprint(found.password) },
			{ subject: 'password-reset', expiresIn: '30 minutes' }
		);

		send(event, found.id, 'password-reset', { token });
		return { success: true };
	}
} satisfies Actions;
