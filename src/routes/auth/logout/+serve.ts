import type { RequestHandler } from '@sveltejs/kit';

import { dev } from '$app/env';

import type { Locals } from '$lib/types';
import { setCookie } from '$lib/cookies';

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || 'wolbodo.nl'

export const post: RequestHandler<Locals, FormData> = () => {
  console.log("Domain:", COOKIE_DOMAIN)
  return {
    status: 200,
    body: null,
    headers: {
      'Set-Cookie': setCookie('token', '', {
        expires: new Date(1970),
        secure: !dev,
        Domain: COOKIE_DOMAIN
      })
    }
  }
}
