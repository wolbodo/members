import { verifyToken } from '$lib/jwt';
import { json, error } from '@sveltejs/kit';

import type { RequestHandler } from './$types'

const omit = (object: Record<string, unknown>, keys: string[]) => Object.fromEntries(Object.entries(object).filter(([key, value]) => !keys.includes(key)))

export const GET = (async (event) => {
  if (!event.locals.user)
    throw error(401)

  return json(omit(event.locals.user, ['token']))
}) satisfies RequestHandler
