import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { createHash } from 'node:crypto';

import { db } from '$lib/server/db';
import { person } from '$lib/server/schema';
import { verifyToken } from '$lib/jwt';
import { hashPassword } from '$lib/hashPassword';
import { send } from '$lib/mail';
import type { Actions } from './$types';

const pwhFingerprint = (hash: string | null | undefined): string =>
	createHash('sha256')
		.update(hash ?? '')
		.digest('hex')
		.slice(0, 16);

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const newPassword = data.get('password') as string;
		const resetToken = data.get('token') as string;

		if (!(newPassword && resetToken)) return fail(400, { error: 'Invalid request' });

		let parsed;
		try {
			parsed = await verifyToken(resetToken);
		} catch {
			return fail(400, { error: 'Invalid token' });
		}

		if (parsed.sub !== 'password-reset') return fail(400, { error: 'Invalid token' });

		const personId = parseInt(parsed.id);
		const [existing] = await db
			.select({ password: person.password })
			.from(person)
			.where(eq(person.id, personId))
			.limit(1);

		if (!existing) return fail(400, { error: 'Invalid token' });
		if (parsed.pwh !== pwhFingerprint(existing.password)) {
			return fail(400, { error: 'Invalid token' });
		}

		const hashed = await hashPassword(newPassword);
		await db.update(person).set({ password: hashed }).where(eq(person.id, personId));

		send(event, personId, 'password-change-notification', {});

		return redirect(302, '/auth/login');
	}
} satisfies Actions;
