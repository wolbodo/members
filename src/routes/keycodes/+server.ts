import { graphql } from '$houdini';
import { serverToken } from '$lib/jwt.js';
import { text, type RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

const getCodes = graphql(`
	query GetCodes {
		keycodes: auth_person {
			key_code
			name
		}
	}
`);

export const GET = (async (event) => {
	const response = await getCodes.fetch({
		event
	});
	const { data } = response;
	console.log(response, event.cookies.getAll());

	if (!data || !data?.keycodes) {
		throw error(400, `unprocessable keycodes`);
	}

	return text(data?.keycodes.map(({ key_code, name }) => `${key_code}; ${name}`).join('\n'));
}) satisfies RequestHandler;
