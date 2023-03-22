import { verifyToken } from '$lib/jwt'
import { fail } from '@sveltejs/kit';

import type { RequestHandler } from './$types'

// The verify endpoint is called when nginx wants to authenticate an [auth_request](http://nginx.org/en/docs/http/ngx_http_auth_request_module.html)

export const GET = (async (event) => {
  const token = event.cookies.get('token');

  try {
    const { name, email } = await verifyToken(token)
    console.log("Verify:", name)
    return new Response(null, {
      status: 200,
      headers: {
        'X-User': name,
        'X-Email': email
      }
    })
  } catch (e) {
    console.error("Error verifying token", e)
    return fail(401)
  }
}) satisfies RequestHandler