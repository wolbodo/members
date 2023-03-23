import { verifyToken } from '$lib/jwt';
import { json, error } from '@sveltejs/kit';

import type { RequestHandler } from './$types'

export const GET = (async (event) => {
  const token = event.cookies.get('token');

  if (!token)
    throw error(401)

  try {
    const data = await verifyToken(token)
    const referer = event.request.headers.get('referer')
    const [cors] = referer?.match(/https:\/\/.*\.wolbodo\.nl/) || []

    if (cors) {
      return json(data, {
        headers: {
          'Access-Control-Allow-Origin': cors,
          'Access-Control-Allow-Credentials': "true",
        }
      })
    }
    return json(data)

  } catch (e) {
    console.error("Error verifying token", e)
    throw error(401)
  }

}) satisfies RequestHandler