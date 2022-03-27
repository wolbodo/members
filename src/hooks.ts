import { getCookies } from '$lib/cookies';
import { verifyToken } from '$lib/jwt'

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession({request}) {
  const { token } = getCookies(request)
  if (token) {
    try {
      const user = await verifyToken(token)
      return {
        user: {
          ...user,
          token
        }
      };
    } catch (e) {
      return {}
    }
  }
  return {}
}