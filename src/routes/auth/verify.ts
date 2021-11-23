import type { RequestHandler } from '@sveltejs/kit';

import type { Locals } from '$lib/types';
import { getCookies } from '$lib/cookies'
import { verifyToken } from '$lib/jwt'

// The verify endpoint is called when nginx wants to authenticate an [auth_request](http://nginx.org/en/docs/http/ngx_http_auth_request_module.html)

export const get: RequestHandler<Locals, FormData> = async ({ headers }) => {
	const { token } = getCookies(headers.cookie);

  try {
    const { name, email } = await verifyToken(token)
    return {
      status: 200,
      body: {},
      headers: {
        'X-User': name,
        'X-Email': email
      }
    }
  } catch (e) {
    console.error("Error verifying token", e)
    return { status: 401, body: {} }
  }
}