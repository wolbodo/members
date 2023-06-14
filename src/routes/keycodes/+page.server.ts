import { graphql } from '$houdini'
import { serverToken } from '$lib/jwt.js'
import type { RequestHandler } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'

const getCodes = graphql(`
  query GetCodes {
    auth_person(where:{
      allow_register: {_eq:true}
      key_code:{_is_null:false}
    }) {
      key_code
      name
    }
  }
`)

export const GET = (async (event) => {
  const token = serverToken('keycodes')
  const { data } = await getCodes.fetch({
    variables: { },
    event,
    metadata: { token }
  })

  if (!data || !data?.keycodes) {
    throw error(400, `unprocessable keycodes`)
  }

  return {
    body: data.keycodes,
  }
} satisfies RequestHandler