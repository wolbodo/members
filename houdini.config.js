/** @type {import('houdini').ConfigFile} */
const defaultMarshall = {
	unmarshal(val) {
		return val;
	},
	marshal(val) {
		return val;
	}
}
console.log("URL:", process.env.GRAPHQL_ENDPOINT)
const config = {
	schemaPath: './schema.graphql',
	sourceGlob: 'src/**/*.svelte',
	module: 'esm',
	framework: 'kit',
	apiUrl: process.env.GRAPHQL_ENDPOINT,

	scalars: {
		uuid: {
			type: 'string',
			...defaultMarshall
		},
		date: {
			type: 'string',
			...defaultMarshall
		},
		jsonb: {
			type: 'object',
			...defaultMarshall
		},
		timestamptz: {
			type: 'string',
			...defaultMarshall
		},
		timestamp: {
			type: 'string',
			...defaultMarshall
		},
		status: {
			type: 'string',
			...defaultMarshall
		}
	}
}


export default config
