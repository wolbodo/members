import { verifyToken } from '$lib/jwt';
import { db } from '$lib/server/db';
import { person } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET = (async (event) => {
	const token = event.cookies.get('token');

	if (!token) error(401);

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

		return new Response(null, { status: 200, headers });
	} catch (e) {
		console.error('Error verifying token', e);
		error(401);
	}
}) satisfies RequestHandler;
