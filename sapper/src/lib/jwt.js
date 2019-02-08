import jwt from 'jsonwebtoken'

export function create(user, defaultRole='user') {
  const SECRET = JSON.parse(process.env.JWT_SECRET)
  const roles = (user.member_roles || []).map(mr => mr.role && mr.role.name)

  defaultRole = roles.includes('admin') ? 'admin': defaultRole
  return jwt.sign({
      name: user.name,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': roles,
        'x-hasura-default-role': defaultRole,
        'x-hasura-user-id': user.id.toString()
      }
  }, SECRET.key, {
    expiresIn: '5 minutes',
    // expiresIn: '10 days',
    issuer: 'auth',
    subject: user.id.toString()
  })
}

export function parse(token) {
  return jwt.decode(token)
}

export async function verify(token) {
  const SECRET = JSON.parse(process.env.JWT_SECRET)

  return await jwt.verify(token, SECRET.key)
}