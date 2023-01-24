import { HoudiniClient, type RequestHandler } from '$houdini';

/* @type { import('$houdini').RequestHandler } */
const requestHandler: RequestHandler = async ({ fetch, text, variables = {}, session }) => {
	const url = 'http://graphql.wolbodo/v1/graphql';
	const result = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session?.user.token}`
		},
		body: JSON.stringify({
			query: text,
			variables
		})
	});

	return await result.json();
};

export default new HoudiniClient(requestHandler);
