export const datetimeAfter = (seconds: number) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + seconds);
  return time;
};

export const getCookies = (cookie) =>
  Object.fromEntries(
    cookie ? cookie.split(';').map((c) => c.split('=').map((c2) => c2.trim())) : []
  );

interface CookieAttributes {
  path?: string
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
  [key: string]: string | boolean | Date
}

export const setCookie = (name: string, value: string, { path = '/', expires, httpOnly = true, secure , ...otherAttrs } : CookieAttributes = {}) : string => {
  expires = expires ?? datetimeAfter(60 * 60 * 24);

  const parts = [
    `${name}=${value}`,
    `Path=${path}`,
    `Expires=${expires}`
  ].concat(Object.entries(otherAttrs).map(([key, value]) => `${key}=${value}`))

  if (secure) {
    parts.push(`Secure`);
  }
  if (httpOnly) {
    parts.push(`HttpOnly`);
  }
  return parts.join('; ');
};
  