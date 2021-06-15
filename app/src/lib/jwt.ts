	
import jwt from 'jsonwebtoken'

type JWTSignOptions = {
  algorithm?: 'HS256' | 'RS256'
  expiresIn?: string; // zeit/ms
  notBefore?: string; // zeit/ms
  audience?: string;
  issuer?: string;
  jwtid?: string;
  subject: string;
  noTimestamp?: string;
  header?: string;
  keyid?: string;
  mutatePayload?: string;
}


export function createToken(
  token: unknown,
  { subject, expiresIn = '1 day', issuer = 'auth', ...options } : JWTSignOptions
) : string {
  const SECRET = JSON.parse(process.env['AUTH_JWT_SECRET'])
  

  return jwt.sign(token, SECRET.key, {
    subject,
    expiresIn,
    issuer,
    ...options,
  })
}

export function parseToken(token : string) : JSON {
  return jwt.decode(token)
}

export async function verifyToken(token : string) : Promise<JSON> {
  const SECRET = JSON.parse(process.env['AUTH_JWT_SECRET'])

  return await jwt.verify(token, SECRET.key)
}

export function serverToken(username : string, id = -1, role = 'server') : string {
  return createToken({
    id: id.toString(),
    name: username,
    roles: [role],
  }, {
    subject: '-1'
  })
}
