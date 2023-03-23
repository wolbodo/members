import type { CookieSerializeOptions } from "cookie";

const domain = process.env.COOKIE_DOMAIN || 'wolbodo.nl'

export const options: CookieSerializeOptions = { secure: false, path: '/', domain };
