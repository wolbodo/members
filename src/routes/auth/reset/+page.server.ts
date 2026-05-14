import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { createHash } from 'node:crypto';

import { db } from '$lib/server/db';
import { person } from '$lib/server/schema';
import { verifyToken } from '$lib/jwt';
import { withAuditContext } from '$lib/server/audit';
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

		// The auth.hash_password DB trigger bcrypts the plaintext on UPDATE,
		// and auth.notify_password_change enqueues the change-notification email.
		// App code must not pre-hash or pre-enqueue.
		await withAuditContext(
			event,
			(tx) => tx.update(person).set({ password: newPassword }).where(eq(person.id, personId)),
			{ id: parsed.id, role: 'password-reset' }
		);

		return redirect(302, '/auth/login');
	}
} satisfies Actions;
