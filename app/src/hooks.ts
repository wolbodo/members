import { parseToken } from '$lib/jwt'

const getCookies = ({ headers : { cookie } }) => Object.fromEntries(cookie.split(';').map(c=>c.split('=').map(c=>c.trim())))

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {

  const { token } = getCookies(request)
  const user = parseToken(token)

	return {
		user: {
      ...user,
      token
    }
	};
}