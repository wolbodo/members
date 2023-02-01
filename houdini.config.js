/// <references types="houdini-svelte">
const defaultMarshall = {
	unmarshal(val) {
		return val;
	},
	marshal(val) {
		return val;
	}
};

/** @type {import('houdini').ConfigFile} */
const config = {
	apiUrl: 'http://graphql.wolbodo/v1/graphql',
	schemaPollHeaders: {
		'x-hasura-admin-secret': 'secret'
	},
	plugins: {
		'houdini-svelte': {}
	},
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
};

export default config;
