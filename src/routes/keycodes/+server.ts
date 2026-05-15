import { text, error, type RequestHandler } from '@sveltejs/kit';
import { isNotNull, eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { person, application } from '$lib/server/schema';
import { safeEqual } from '$lib/safeEqual';

export const GET = (async (event) => {
	const auth = event.request.headers.get('Authorization');
	const name = event.url.searchParams.get('name');
	const bearer = auth?.startsWith('Bearer ') ? auth.slice('Bearer '.length) : null;

	if (!name || !bearer) error(401);

	const [app] = await db
		.select({ secret: application.secret })
		.from(application)
		.where(eq(application.name, name))
		.limit(1);

	if (!app || !safeEqual(app.secret, bearer)) error(401);

	const rows = await db
		.select({ key_code: person.key_code, name: person.name })
		.from(person)
		.where(isNotNull(person.key_code));

	return text(rows.map(({ key_code, name }) => `${key_code}; ${name}`).join('\n'));
}) satisfies RequestHandler;
