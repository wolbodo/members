// Endpoint for getting a mercure token

import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { getCookies } from '$lib/cookies';
import { verifyToken } from '$lib/jwt';

export const get: RequestHandler<Locals, FormData> = async ({ request }) => {
  // Check login
	const { token } = getCookies(request.headers.cookie);

  try {
    const data = await verifyToken(token)
    const [ref] = request.headers.referer.match(/https:\/\/.*\.wolbodo\.nl/) || []
    return {
      headers: ref
        ? {
          'Access-Control-Allow-Origin': ref,
          'Access-Control-Allow-Credentials': true,
        } : {},
      body: data
    }
  } catch (e) {
    console.error("Error verifying token", e)
    return { status: 401, body: {} }
  }
}
