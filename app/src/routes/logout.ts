import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';

export const get: RequestHandler<Locals, FormData> = () => ({
  status: 200,
  body: null,
  headers: {
    'Set-Cookie': 'token=gone; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly'
  }
})
