// Endpoint for getting a mercure token

import { getCookies } from '$lib/cookies';
import { verifyToken } from '$lib/jwt';

export async function get({ request }) {
  // Check login
	const { token } = getCookies(request);

  try {
    const data = await verifyToken(token)
    const referer = request.headers.get('referer')
    const [ref] = referer.match(/https:\/\/.*\.wolbodo\.nl/) || []
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
