import jwt from 'jsonwebtoken'

export function create(user, defaultRole='user') {
  const roles = (user.member_roles || []).map(mr => mr.role && mr.role.name)
  console.log("SECRET:", process.env.JWT_SECRET)
  const SECRET = JSON.parse(process.env.JWT_SECRET)

  defaultRole = roles.includes('admin') ? 'admin': defaultRole
  return jwt.sign({
      name: user.name,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': roles,
        'x-hasura-default-role': defaultRole,
        'x-hasura-user-id': user.id.toString()
      }
  }, SECRET.key, {
    // expiresIn: '10 seconds',
    expiresIn: '10 days',
    issuer: 'auth',
    subject: user.id.toString()
  })
}

export function parse(token) {
  return jwt.decode(token)
}