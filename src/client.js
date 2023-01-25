import { HoudiniClient } from '$houdini';

/* @type { import('$houdini').RequestHandler } */
const requestHandler = async ({ fetch, text, variables = {}, session, metadata }) => {
	const url = 'http://graphql.wolbodo/v1/graphql';

	const token = session.user ? session.user.token : metadata.token;

	const result = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(token && {
				Authorization: `Bearer ${token}`
			})
		},
		body: JSON.stringify({
			query: text,
			variables
		})
	});

	return await result.json();
};

export default new HoudiniClient(requestHandler);
