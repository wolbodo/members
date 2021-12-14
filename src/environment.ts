import { Environment } from '$houdini'

export default new Environment(async function ({ text, variables = {} }, session) {
	const headers: { Authorization?: string} = {};
	if (session.user) {
		headers.Authorization = `Bearer ${session.user.token}`;
	}
	console.log("Got role:", this.stuff?.currentRole || session.currentRole)
	if (this.stuff?.currentRole || session.currentRole ) {
		headers['X-Hasura-Role'] = this.stuff?.currentRole || session.currentRole
	}

	// send the request to the api
	const result = await this.fetch(import.meta.env.VITE_GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		body: JSON.stringify({
			query: text,
			variables,
		}),
	})

	// parse the result as json
	return await result.json()
})
