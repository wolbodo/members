import { verifyToken } from '$lib/jwt'

const getCookies = ({headers: {cookie}}) => Object.fromEntries(
  cookie
    ? cookie.split(";")
            .map((c) => c.split("=").map((c2) => c2.trim()))
    : []
);

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession(request) {
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