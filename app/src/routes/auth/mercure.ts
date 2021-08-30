// Endpoint for getting a mercure token

import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { setCookie } from '$lib/cookies';
import jwt from 'jsonwebtoken'

const MERCURE_JWT_SECRET = process.env['MERCURE_JWT_SECRET']
const MERCURE_DOMAIN = process.env['MERCURE_DOMAIN']


export const get: RequestHandler<Locals, FormData> = () => {
  // Check login
  
  const token = jwt.sign({
    mercure: {
      subscribe: ["*"],
      publish: ["*"],
    }
  }, MERCURE_JWT_SECRET)

  return {
    status: 200,
    body: null,
    headers: {
      'Access-Control-Allow-Origin': 'https://votes.wolbodo.nl',
      'Access-Control-Allow-Credentials': true,
      'Set-Cookie': setCookie('mercureAuthorization', token, { Domain: MERCURE_DOMAIN,  SameSite: 'None' })
    }
  }
}
