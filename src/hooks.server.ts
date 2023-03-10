import { setSession } from '$houdini';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { verifyToken } from '$lib/jwt';
import { worker as serverWorker } from './mocks/server';

serverWorker?.listen();

const authenticateUser = async (event: RequestEvent) => {
	const token = event.cookies.get('token');

	if (token) {
		try {
			const user = await verifyToken(token);

			return {
				...user,
				token
			};
		} catch (e) {
			return null;
		}
	}
};
export const handle: Handle = async ({ event, resolve }) => {
	// get the user information however you want
	const user = await authenticateUser(event);

	if (!event.url.pathname.startsWith('/auth') && !user) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/auth/login'
			}
		});
	}

	if (user) {
		// set the session information for this event
		setSession(event, { user });
		event.locals.user = user;
	}

	// pass the event onto the default handle
	return await resolve(event);
};
