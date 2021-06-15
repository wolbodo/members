import type { RequestHandler } from '@sveltejs/kit';

import { send } from '$lib/mail'
import type { Locals } from '$lib/types';
import { serverToken, verifyToken } from '$lib/jwt'
import { client, token, gql } from '$lib/graphql'

export const post: RequestHandler<Locals, FormData> = async (request) => {
	const password = request.body.get('password')
  const resetToken = request.body.get('token')

  if (!(password && resetToken)) {
    return { status: 400 }
  }
    
	token.set(serverToken('password-reset'))

  const { sub, id } = await verifyToken(resetToken)

  if (sub !== 'password-reset') throw new Error('Token invalid')

  await client.request(gql`
    mutation changePassword($id:Int!, $password:String!){
      update_auth_person(where:{id:{_eq:$id}}, _set:{
        password:$password
      }) {
        affected_rows
      }
    }
  `, { id, password })

  return { status: 200, body: {} }
}