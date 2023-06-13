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
	logLevel: 'full',

	watchSchema: {
		url: 'http://graphql.wolbodo.nl/v1/graphql',
		headers: {
			'x-hasura-admin-secret': '4P5eRndatPN5bWq6GOUC0FCU10H0TaBKHAEEF8cTCHlb771Y4ekzshYcj400'
		},
		interval: 20000
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
