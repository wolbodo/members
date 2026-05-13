import { error, redirect } from '@sveltejs/kit';
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

		if (!(newPassword && resetToken)) error(400);

		const { sub, id } = await verifyToken(resetToken);
		if (sub !== 'password-reset') error(400);

		const hashed = await bcrypt.hash(newPassword, 10);
		await db
			.update(person)
			.set({ password: hashed })
			.where(eq(person.id, parseInt(id)));

		return redirect(302, '/');
	}
} satisfies Actions;
