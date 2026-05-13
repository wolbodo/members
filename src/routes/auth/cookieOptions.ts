import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';

const domain = dev ? undefined : (process.env.COOKIE_DOMAIN || 'wolbodo.nl');
const secure = process.env.COOKIE_SECURE === 'true';

type CookieOptions = Parameters<Cookies['set']>[2];

export const options: CookieOptions = {
	...(domain ? { domain } : {}),
	secure,
	path: '/',
	sameSite: dev ? 'lax' : 'none'
};
