import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types'
import { options as tokenCookieOptions } from '../cookieOptions'

// The verify endpoint is called when nginx wants to authenticate an [auth_request](http://nginx.org/en/docs/http/ngx_http_auth_request_module.html)

export const GET = (async (event) => {
  event.cookies.delete('token', tokenCookieOptions);

  throw redirect(302, '/');
}) satisfies RequestHandler