import type { CookieSerializeOptions } from 'cookie';

const domain = process.env.COOKIE_DOMAIN || 'wolbodo.nl';
const secure = process.env.COOKIE_SECURE === 'true';

export const options: CookieSerializeOptions = {
	domain,
	secure,
	path: '/',
	sameSite: 'none'
};
