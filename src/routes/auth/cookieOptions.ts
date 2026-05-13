import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

const domain = dev ? undefined : (env.COOKIE_DOMAIN || 'wolbodo.nl');
const secure = env.COOKIE_SECURE === 'true';

type CookieOptions = Parameters<Cookies['set']>[2];

export const options: CookieOptions = {
	...(domain ? { domain } : {}),
	secure,
	path: '/',
	sameSite: dev ? 'lax' : 'none'
};
