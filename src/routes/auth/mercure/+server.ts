// Endpoint for getting a mercure token
import { fail } from '@sveltejs/kit';
import jwt from 'jsonwebtoken'

import { verifyToken } from '$lib/jwt';
import { env } from '$env/dynamic/private';

import type { RequestHandler } from './$types'

export const GET = (async (event) => {
  // Check login
  const token = event.cookies.get('token');

  try {
    const { name, roles } = await verifyToken(token)

    const isBoard = roles.includes('board')
    const mercureToken = jwt.sign({
      mercure: {
        payload: { name, isBoard },
        subscribe: ["*"],
      }
    }, env.MERCURE_JWT_SECRET)

    const headers = new Headers()

    const referer = event.request.headers.get('referer')
    const [origin] = referer?.match(/https:\/\/.*\.wolbodo\.nl/) || []

    if (origin) {
      headers.set('Access-Control-Allow-Origin', origin);
      headers.set('Access-Control-Allow-Credentials', 'true');
    }
    event.request.headers.set(
      'mercureAuthorization',
      mercureToken,
      {
        Domain: env.MERCURE_DOMAIN,
        SameSite: 'None'
      }
    );

    return new Response(null, { headers });
  } catch (e) {
    console.error("Error verifying token", e)
    return fail(401)
  }
}) satisfies RequestHandler