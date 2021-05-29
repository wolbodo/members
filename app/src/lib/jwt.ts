	
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
  const SECRET = JSON.parse(process.env.AUTH_JWT_SECRET)

  return await jwt.verify(token, SECRET.key)
}

// export function createUserToken(user, defaultRole = 'user') {
//   return createToken(
//     {
//       name: user.name,
//       email: user.email,
//       'https://hasura.io/jwt/claims': {
//         'x-hasura-allowed-roles': user.roles,
//         'x-hasura-default-role': defaultRole,
//         'x-hasura-user-id': user.id.toString(),
//       },
//     },
//     {
//       subject: user.id.toString(),
//     }
//   )
// }

// export function createRefreshToken(userId, expiresIn = '10 days') {
//   const SECRET = JSON.parse(process.env.AUTH_JWT_SECRET)
//   return jwt.sign(
//     {
//       type: 'refresh',
//     },
//     SECRET.key,
//     {
//       expiresIn,
//       issuer: 'auth',
//       subject: userId.toString(),
//     }
//   )
// }

export function serverToken(username : string, role = 'server') : string {
  return createToken({
    'name': username,
    'id': '-1',
    'roles': [role],
  }, {
    subject: '-1'
  })
}
