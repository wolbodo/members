import jwt from 'jsonwebtoken'

export function createToken (user, defaultRole = 'user') {
  const SECRET = JSON.parse(process.env.AUTH_JWT_SECRET)
  const roles = (user.member_roles || []).map(mr => mr.role && mr.role.name)

  defaultRole = roles.includes('admin') ? 'admin' : defaultRole
  return jwt.sign({
    name: user.name,
    email: user.email,
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': roles,
      'x-hasura-default-role': defaultRole,
      'x-hasura-user-id': user.id.toString()
    }
  }, SECRET.key, {
    expiresIn: '1 day',
    issuer: 'auth',
    subject: user.id.toString()
  })
}

export function createRefreshToken (userId, expiresIn = '10 days') {
  const SECRET = JSON.parse(process.env.AUTH_JWT_SECRET)
  return jwt.sign({
    type: 'refresh'
  }, SECRET.key, {
    expiresIn,
    issuer: 'auth',
    subject: userId.toString()
  })
}

export function parseToken (token) {
  return jwt.decode(token)
}

export async function verifyToken (token) {
  const SECRET = JSON.parse(process.env.AUTH_JWT_SECRET)

  return await jwt.verify(token, SECRET.key)
}

export function serverToken (username, role) {
  return createToken({
    id: -1,
    name: username,
    member_roles: [
      { role: { name: role}}
    ]
  }, role)
}
