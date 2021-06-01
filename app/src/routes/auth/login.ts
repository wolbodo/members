import bcrypt from 'bcryptjs'
import { Temporal } from 'proposal-temporal'
import type { RequestHandler } from '@sveltejs/kit';

import type { Locals } from '$lib/types';
import { serverToken, createToken } from '$lib/jwt'
import { client, token, gql } from '$lib/graphql'
import { cookie } from './_cookie';

export const post: RequestHandler<Locals, FormData> = async (request) => {
	const name = request.body.get('name')
	const password = request.body.get('password')

	const _token = serverToken('login')
	token.set(_token)

	const { auth_person: [person] } = await client.request(gql`
		query getPassword($name: String!) {
			auth_person(where:{name:{_ilike:$name}}) {
				email name id
				password
				roles {
					role
				}
			}
		}
	`, { name })


	if (person && person.password) {
		const ok = await bcrypt.compare(
			password,
			person.password
		)

		if (ok) {
			delete person.password
			const user = {
				...person,
				roles: person.roles.map(({ role }) => role)
			}
			delete user.password
			user.token = createToken({
				...user,
				id: user.id.toString()
			}, {
				subject: user.id.toString()
			})

			return {
				status: 200,
				headers: {
					'Set-Cookie': cookie(user.token, Temporal.now.plainDateTimeISO().add(Temporal.Duration.from({hours: 1})))
				},
				body: user
			}
		}
	}

	return {
		status: 401,
		body: 'Invalid credentials'
	};
};
