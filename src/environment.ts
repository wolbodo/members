import { Environment } from '$houdini'

export default new Environment(async function ({ text, variables = {} }, session) {
	const headers: { Authorization?: string} = {};
	console.log("HI", this)
	if (session.user) {
		headers.Authorization = `Bearer ${session.user.token}`;
	}
	
	if (this.stuff?.currentRole || session.currentRole ) {
		headers['X-Hasura-Role'] = this.stuff?.currentRole || session.currentRole
	}

	console.log(headers)
	// send the request to the api
	const result = await this.fetch('http://graphql.wolbodo/v1/graphql', {
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
