import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { person } from '$lib/server/schema';
import { verifyToken } from '$lib/jwt';
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const newPassword = data.get('password') as string;
		const resetToken = data.get('token') as string;

		if (!(newPassword && resetToken)) return fail(400, { error: 'Invalid request' });

		const { sub, id } = await verifyToken(resetToken);
		if (sub !== 'password-reset') return fail(400, { error: 'Invalid token' });

		const hashed = await bcrypt.hash(newPassword, 10);
		await db
			.update(person)
			.set({ password: hashed })
			.where(eq(person.id, parseInt(id)));

		return redirect(302, '/');
	}
} satisfies Actions;
