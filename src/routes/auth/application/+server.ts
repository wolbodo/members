import { graphql } from '$houdini';
import { serverToken } from '$lib/jwt.js';
import { text, type RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { options as tokenCookieOptions } from '../cookieOptions';

const getApplication = graphql(`
	query GetApplication($name: String!) {
		apps: auth_application_by_pk(name: $name) {
			role
			secret
		}
	}
`);

export const GET = (async (event) => {
	const secret = event.request.headers.get('Secret');
	const name = event.url.searchParams.get('name');

	if (!name || !secret) {
		throw error(400);
	}

	const token = serverToken('applications');
	const { data } = await getApplication.fetch({
		variables: { name },
		event,
		metadata: { token }
	});

	if (!data || !data?.apps || data?.apps?.secret !== secret) {
		throw error(400);
	}

	event.cookies.set('token', serverToken(name, -1, data.apps.role), tokenCookieOptions);

	return text('ok');

	// return text(data?.keycodes.map(({ key_code, name }) => `${key_code}; ${name}`).join('\n'));
}) satisfies RequestHandler;
