import type { Handle, RequestEvent, HandleFetch } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/jwt';

const authenticateUser = async (event: RequestEvent) => {
	const token = event.cookies.get('token');
	if (!token) return null;
	try {
		const user = await verifyToken(token);
		return { ...user, token };
	} catch {
		return null;
	}
};

export const handle: Handle = async ({ event, resolve }) => {
	const user = await authenticateUser(event);

	if (!user) {
		if (event.route.id !== '/mail/trigger' && !event.route.id?.startsWith('/auth')) {
			return redirect(302, '/auth/login');
		}
	} else {
		if (event.route.id === '/auth/login') {
			return redirect(302, '/');
		}
		event.locals.user = user;
	}

	const response = await resolve(event);

	const originHeader = event.request.headers.get('origin');
	if (originHeader) {
		const referer = new URL(originHeader);
		if (/^https?:\/\/localhost:\d+|^https:\/\/.*\.wolbodo\.nl/.test(referer.origin)) {
			response.headers.append('Access-Control-Allow-Origin', referer.origin);
			response.headers.append('Access-Control-Allow-Credentials', 'true');
		}
	}

	return response;
};

export const handleFetch = (async ({ request, fetch }) => {
	try {
		return await fetch(request);
	} catch (error) {
		console.error('error in fetch', error);
		throw error;
	}
}) satisfies HandleFetch;
