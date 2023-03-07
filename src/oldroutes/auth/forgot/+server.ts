import { gql, GraphQLClient } from 'graphql-request';
import type { RequestHandler } from '@sveltejs/kit';

import { send } from '$lib/mail';
import type { Locals } from '$lib/types';
import { GRAPHQL_ENDPOINT } from '$lib/config';
import { serverToken, createToken } from '$lib/jwt';

const client = new GraphQLClient(GRAPHQL_ENDPOINT);

export async function post({ request }) {
	const body = await request.formData();
	const email = body.get('email');

	if (!email) {
		return { status: 400 };
	}

	client.setHeader('authorization', `Bearer ${serverToken('password-forgot')}`);

	const {
		person: [person]
	} = await client.request(
		gql`
			query personByEmail($email: String!) {
				person: auth_person(where: { email: { _ilike: $email } }) {
					id
					name
				}
			}
		`,
		{ email }
	);

	if (!person) {
		console.log(`Reset failed: email address '${email}' unknown`);
	} else {
		const token = createToken(
			{
				id: person.id
			},
			{
				subject: 'password-reset',
				expiresIn: '30 minutes'
			}
		);

		console.log(`Reset mail: to ${person.name}(${email})`);
		send(person.id, 'password-reset', { token });
	}

	return { status: 200, body: {} };
}
