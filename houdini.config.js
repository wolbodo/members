/** @type {import('houdini').ConfigFile} */
const defaultMarshall = {
	unmarshal(val) {
		return val;
	},
	marshal(val) {
		return val;
	}
}

const config = {
	schemaPath: './schema.graphql',
	sourceGlob: 'src/**/*.svelte',
	module: 'esm',
	framework: 'kit',
	apiUrl: import.meta.env.VITE_GRAPHQL_ENDPOINT,

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
