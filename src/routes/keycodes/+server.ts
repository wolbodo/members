import { text, type RequestHandler } from '@sveltejs/kit';
import { isNotNull } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { person } from '$lib/server/schema';

export const GET = (async () => {
	const rows = await db
		.select({ key_code: person.key_code, name: person.name })
		.from(person)
		.where(isNotNull(person.key_code));

	return text(rows.map(({ key_code, name }) => `${key_code}; ${name}`).join('\n'));
}) satisfies RequestHandler;
