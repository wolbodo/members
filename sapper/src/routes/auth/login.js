import bcrypt from 'bcryptjs'
import gql from 'graphql-tag'

import { createToken, serverToken, createRefreshToken } from 'src/lib/jwt'
import createStore from 'src/stores'

const { GRAPHQL_LOCAL_URI, COOKIE_DOMAIN = 'wolbodo.nl' } = process.env;

export async function post(req, res) {
  const store = createStore({
    graphqlUri: GRAPHQL_LOCAL_URI,
    token: serverToken('server:login', 'server'),
    role: 'server'
  })

  try {
    const result = await store.gqlQuery({
      query: gql`
        query($email: String) {
          active_member(where:{email:{_eq:$email}}) {
            id name email password
            member_roles {
              role {
                name
              }
            }
          }
        }
      `,
      variables: {
        email: req.body.email
      }
    })
    const { active_member: [member, ] } = result.data

    if (member) {
      const passwordOk = await bcrypt.compare(req.body.password, member.password)
        
      if (passwordOk) {
        const jwt = createToken(member)
        const refresh = createRefreshToken(member.id)

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${jwt}; Domain=${COOKIE_DOMAIN}; Path=/; Secure; HttpOnly`,
        })
        res.end(JSON.stringify({
          jwt,
          refresh,
          user: {
            id: member.id,
            email: member.email,
            name: member.name,
            roles: member.member_roles.map(mr => mr.role.name)
          }
        }))
      }
    }
    res.writeHead(401, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify({
      error: 'Authentication failed'
    }))
  } catch (e) {
    console.error('Error logging in', e)
    res.writeHead(500, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify({
      error: e.toString()
    }))
  }
}