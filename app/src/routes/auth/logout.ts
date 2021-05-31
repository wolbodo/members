import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { cookie } from './_cookie'

export const post: RequestHandler<Locals, FormData> = () => ({
  status: 200,
  body: null,
  headers: {
    'Set-Cookie': cookie()
  }
})
