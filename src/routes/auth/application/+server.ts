import { text, error, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { application } from '$lib/server/schema';
import { serverToken } from '$lib/jwt';
import { options as tokenCookieOptions } from '../cookieOptions';

export const GET = (async (event) => {
	const secret = event.request.headers.get('Secret');
	const name = event.url.searchParams.get('name');

	if (!name || !secret) error(400);

	const [app] = await db
		.select({ role: application.role, secret: application.secret })
		.from(application)
		.where(eq(application.name, name))
		.limit(1);

	if (!app || app.secret !== secret) error(400);

	event.cookies.set('token', serverToken(name, -1, app.role), tokenCookieOptions);
	return text('ok');
}) satisfies RequestHandler;
