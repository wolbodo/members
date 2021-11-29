import { gql, GraphQLClient } from 'graphql-request'
import type { RequestHandler } from '@sveltejs/kit';

import type { Locals } from '$lib/types';
import { GRAPHQL_ENDPOINT } from '$lib/config'
import { serverToken, verifyToken } from '$lib/jwt'

const client = new GraphQLClient(GRAPHQL_ENDPOINT)

export const post: RequestHandler<Locals, FormData> = async (request) => {
	const password = request.body.get('password')
  const resetToken = request.body.get('token')

  if (!(password && resetToken)) {
    return { status: 400 }
  }
    
  const { sub, id } = await verifyToken(resetToken)

  // Edit on behalf of the user
  client.setHeader('authorization', `Bearer ${serverToken('password-reset', id)}`)

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