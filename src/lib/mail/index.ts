import { gql, GraphQLClient } from 'graphql-request';

import { serverToken } from '$lib/jwt';
import { GRAPHQL_ENDPOINT } from '$lib/config';
import { SendMailStore } from '$houdini';

const client = new GraphQLClient(GRAPHQL_ENDPOINT);

export { default as templates } from './templates';
export const send = (personId, template, data) => {
	client.setHeader('authorization', `Bearer ${serverToken('send-mail')}`);
	client.request(gql``, {
		personId,
		template,
		data
	});
};
