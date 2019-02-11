import gql from 'graphql-tag'

import { createToken, serverToken, verifyToken } from 'src/lib/jwt'
import createStore from 'src/stores'

const {
  GRAPHQL_LOCAL_URI,
  COOKIE_DOMAIN = 'wolbodo.nl',
  COOKIE_SECURE = 'true'
} = process.env

export async function post (req, res) {
  const store = createStore({
    graphqlUri: GRAPHQL_LOCAL_URI,
    token: serverToken('server:refresh', 'server'),
    role: 'server'
  })

  try {
    const { refreshToken } = req.body

    if (refreshToken) {
      const { sub } = await verifyToken(refreshToken)
      // Parse refreshToken
      console.log('Parsed:', sub)

      const { data: { active_member: [member ] = [] } = {} } = await store.gqlQuery({
        query: gql`
          query($id: Int!) {
            active_member(where:{id:{_eq:$id}}) {
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
          id: sub
        }
      })

      if (member) {
        const token = createToken(member)

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${
                          token
                        }; Domain=${
                          COOKIE_DOMAIN
                        }; Path=/; ${
                          (COOKIE_SECURE === 'true') ? 'Secure;' : ''
                        }  HttpOnly`
        })
        res.end(JSON.stringify({
          token,
          user: {
            id: member.id,
            email: member.email,
            name: member.name,
            roles: member.member_roles.map(mr => mr.role.name)
          }
        }))
        return
      }
    }
  } catch (e) {
    console.log('error', e)
    res.writeHead(401, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify({
      error: 'refreshToken expired'
    }))
  }

  res.writeHead(401, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify({
    error: 'refreshToken invalid'
  }))
}
