import { error } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

import { verifyToken } from '$lib/jwt';
import { env } from '$env/dynamic/private';

import type { RequestHandler } from './$types';

export const GET = (async (event) => {
	const token = event.cookies.get('token');

	if (!token) error(401, 'invalid token');

	try {
		const { name, roles } = await verifyToken(token);

		const isBoard = roles.includes('board');
		const mercureToken = jwt.sign(
			{ mercure: { payload: { name, isBoard }, subscribe: ['*'] } },
			env.MERCURE_JWT_SECRET
		);

		const headers = new Headers();
		const referer = event.request.headers.get('referer');
		const [origin] = referer?.match(/https:\/\/.*\.wolbodo\.nl/) || [];

		if (origin) {
			headers.set('Access-Control-Allow-Origin', origin);
			headers.set('Access-Control-Allow-Credentials', 'true');
		}
		event.cookies.set('mercureAuthorization', mercureToken, {
			path: '/',
			domain: env.MERCURE_DOMAIN,
			sameSite: 'none'
		});

		return new Response(null, { headers });
	} catch (e) {
		console.error('Error verifying token', e);
		error(401, 'invalid token');
	}
}) satisfies RequestHandler;
