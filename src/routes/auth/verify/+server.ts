import { verifyToken } from '$lib/jwt';
import { db } from '$lib/server/db';
import { person } from '$lib/server/schema';
import { debug, warn } from '$lib/server/log';
import { eq } from 'drizzle-orm';
import { error as httpError } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET = (async (event) => {
	const token = event.cookies.get('token');

	if (!token) httpError(401);

	try {
		const { id, name, roles } = await verifyToken(token);

		const [row] = await db
			.select({ email: person.email })
			.from(person)
			.where(eq(person.id, parseInt(id)))
			.limit(1);

		const headers = new Headers({
			'X-User': name,
			'X-User-Id': id,
			'X-Roles': (roles ?? []).join(',')
		});
		if (row?.email) headers.set('X-Email', row.email);

		debug('auth/verify: verified', { id, name });
		return new Response(null, { status: 200, headers });
	} catch (err) {
		warn('auth/verify: token verification failed', { err });
		httpError(401);
	}
}) satisfies RequestHandler;
