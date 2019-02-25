import gql from 'graphql-tag'

import createStore from 'src/stores'
import { verifyToken, serverToken } from 'src/lib/jwt'

const { GRAPHQL_LOCAL_URI } = process.env

export async function get (req, res) {
  // Parse token, and return user info

  const store = createStore({
    graphqlUri: GRAPHQL_LOCAL_URI,
    token: serverToken('server:self', 'server'),
    role: 'server'
  })

  try {
    if (!req.token) {
      console.error('no token')
      res.writeHead(401)
      res.end()
    }
    const t = await verifyToken(req.token)

    const result = await store.gqlQuery({
      query: gql`
        query($id: Int) {
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
        id: t.sub
      }
    })
    const { active_member: [member ] } = result.data
    let headers = {
      'Content-Type': 'application/json'
    }

    console.log('headers:', req.headers)
    if (req.headers.origin && (req.headers.origin.includes('localhost') || req.headers.origin.includes('wlbd.nl'))) {
      headers = {
        ...headers,
        'Access-Control-Allow-Origin': req.headers.origin,
        'Access-Control-Allow-Credentials': true
      }
    }

    res.writeHead(200, headers)
    res.end(JSON.stringify({
      user: {
        id: member.id,
        email: member.email,
        name: member.name,
        roles: member.member_roles.map(mr => mr.role.name)
      }
    }))
  } catch (e) {
    console.error('verify fail', e)
    res.writeHead(401)
    res.end()
  }
}
