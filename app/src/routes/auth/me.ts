// Endpoint for getting a mercure token

import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { getCookies } from '$lib/cookies';
import { verifyToken } from '$lib/jwt';

export const get: RequestHandler<Locals, FormData> = async ({ headers }) => {
  // Check login
	const { token } = getCookies(headers.cookie);

  try {
    const data = await verifyToken(token)
    return {
      headers: (/https:\/\/.*\.wolbodo\.nl/.test(headers.referer))
        ? {
          'Access-Control-Allow-Origin': headers.referer,
          'Access-Control-Allow-Credentials': true,
        } : {},
      body: data
    }
  } catch (e) {
    console.error("Error verifying token", e)
    return { status: 401, body: {} }
  }
}
