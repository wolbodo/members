// Endpoint for getting a mercure token

import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { setCookie, getCookies } from '$lib/cookies';
import { verifyToken } from '$lib/jwt';
import jwt from 'jsonwebtoken'

const MERCURE_JWT_SECRET = process.env['MERCURE_JWT_SECRET']
const MERCURE_DOMAIN = process.env['MERCURE_DOMAIN']


export async function get({ request }) {
  // Check login
	const { token } = getCookies(request.headers.cookie);

  try {
    const { name, roles } = await verifyToken(token)

    const isBoard = roles.includes('board')
    const mercureToken = jwt.sign({
      mercure: {
        payload: { name, isBoard },
        subscribe: ["*"],
      }
    }, MERCURE_JWT_SECRET)

    const [ref] = request.headers.referer.match(/https:\/\/.*\.wolbodo\.nl/) || []

    return {
      status: 200,
      body: null,
      headers: {
        ...ref && {
              'Access-Control-Allow-Origin': ref,
              'Access-Control-Allow-Credentials': true,
        },
        'Set-Cookie': setCookie('mercureAuthorization', mercureToken, { Domain: MERCURE_DOMAIN,  SameSite: 'None' })
      }
    }
  } catch (e) {
    console.error("Error verifying token", e)
    return { status: 401, body: {} }
  }
  
}
