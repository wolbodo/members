import bcrypt from 'bcryptjs'

import { client, gql } from '$lib/graphql-client'
import { serverToken, createToken } from '$lib/jwt'
import { setCookie } from '$lib/cookies';
import { dev } from '$app/env';

// These are the only roles passed to the token, and in this order.
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || 'wolbodo.nl'
const ALL_ROLES = ['member', 'board', 'admin', 'self']

/** @type {import('./items').RequestHandler} */
export async function post ({ request }) {
	const data = await request.formData(); // or .json(), or .text(), etc
	const name = data.get('name')
	const password = data.get('password')	

	console.log("Login from:", name)

	client.setHeader('authorization', `Bearer ${serverToken('login')}`)

	const { auth_person: [person] } = await client.request(gql`
		query getPassword($name: String!) {
			auth_person(where:{_or: [{name:{_ilike:$name}}, {email:{_eq:$name}} ]}) {
				email name id
				password
				roles(where:{valid_till:{_is_null:true}, valid_from:{_lte:"NOW()"}}) {
					role
				}
			}
		}
	`, { name })


	if (person && person.password && person.roles.length) {
		const ok = await bcrypt.compare(
			password,
			person.password
		)

		if (ok) {
			// Remove the password else it will end up at the client.
			delete person.password

			const roles = [
				...person.roles.map(({ role }) => role),
				'self'
			]
			const user = {
				...person,
				roles: ALL_ROLES.filter(role => roles.includes(role))
			}

			user.token = createToken({
				...user,
				id: user.id.toString()
			}, {
				subject: user.id.toString()
			})

			return {
				status: 200,
				headers: {
					'Set-Cookie': setCookie('token', user.token, { 
						secure: !dev,
						Domain: COOKIE_DOMAIN
					})
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