import type { RequestHandler } from '@sveltejs/kit';

import { send } from '$lib/mail'
import type { Locals } from '$lib/types';
import { serverToken, createToken } from '$lib/jwt'
import { client, token, gql } from '$lib/graphql'

export const post: RequestHandler<Locals, FormData> = async (request) => {
	const email = request.body.get('email')

  if (!email) {
    return { status: 400 }
  }
    
	token.set(serverToken('password-forgot'))

  const { person: [person]} = await client.request(gql`
    query personByEmail($email: String!) {
      person: auth_person(where: {email: {_eq: $email}}) {
        id name
      }
    }
  `, { email })

  if (!person) {
    console.log(`Reset failed: email address '${email}' unknown`)
  } else {
    const token = createToken({
      id: person.id,
    }, {
      subject: 'password-reset',
      expiresIn: '30 minutes'
    })

    console.log(`Reset mail: to ${person.name}(${email})`)
    send(person.id, 'password-reset', { token })
  }

  return { status: 200, body: {} }
}