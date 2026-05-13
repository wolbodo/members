import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { eq, or, ilike, and, isNull, lte } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { person, personRole } from '$lib/server/schema';
import { createToken } from '$lib/jwt';
import { safeRedirect } from '$lib/safeRedirect';
import type { Actions } from './$types';
import { options as tokenCookieOptions } from '../cookieOptions';

const ALL_ROLES = ['member', 'board', 'admin', 'self'] as const;

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const name = data.get('name') as string;
		const password = data.get('password') as string;

		const [found] = await db
			.select({
				id: person.id,
				name: person.name,
				email: person.email,
				password: person.password,
				roles: db.$count(personRole, eq(personRole.person_id, person.id))
			})
			.from(person)
			.where(or(ilike(person.name, name), eq(person.email, name)))
			.limit(1);

		if (!found) return fail(400, { name, incorrect: true });

		const activeRoles = await db
			.select({ role: personRole.role })
			.from(personRole)
			.where(
				and(
					eq(personRole.person_id, found.id),
					isNull(personRole.valid_till),
					lte(personRole.valid_from, new Date())
				)
			);

		if (!found.password || !activeRoles.length) return fail(400, { name, incorrect: true });

		const ok = await bcrypt.compare(password, found.password);
		if (!ok) return fail(400, { name, incorrect: true });

		const roleNames = [...activeRoles.map((r) => r.role), 'self'];
		const roles = ALL_ROLES.filter((r) => roleNames.includes(r));

		const token = createToken(
			{ id: found.id.toString(), name: found.name, roles },
			{ subject: found.id.toString() }
		);

		const location = safeRedirect(data.get('redirect') as string | null);

		event.cookies.set('token', token, tokenCookieOptions);
		return redirect(302, location);
	}
} satisfies Actions;
