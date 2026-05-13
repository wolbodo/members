import { verifyToken } from '$lib/jwt';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET = (async (event) => {
	const token = event.cookies.get('token');

	if (!token) error(401);

	try {
		const { name, email } = await verifyToken(token);
		return new Response(null, {
			status: 200,
			headers: { 'X-User': name, 'X-Email': email }
		});
	} catch (e) {
		console.error('Error verifying token', e);
		error(401);
	}
}) satisfies RequestHandler;
