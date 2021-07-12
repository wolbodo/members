import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { setCookie } from '$lib/cookies';

export const post: RequestHandler<Locals, FormData> = () => ({
  status: 200,
  body: null,
  headers: {
    'Set-Cookie': cookie('token', '', { expires: new Date(1970) })
  }
})
