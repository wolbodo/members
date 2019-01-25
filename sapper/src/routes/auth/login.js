import bcrypt from 'bcryptjs'
import gql from 'graphql-tag'

import * as JWT from 'src/lib/jwt'
import createStore from 'src/stores'


export async function post(req, res, next) {
  const store = createStore()
  const token = JWT.create({
    id: -1,
    name: 'login',
    member_roles: [
      { role: { name: 'login'}}
    ]
  }, 'login');
  const client = store.getServerClient('http://graphql/v1alpha1/graphql', token, 'login')

  try {
    const result = await client.query({
      query: gql`
        query($email: String) {
          active_member(where:{email:{_eq:$email}}) {
            id email password
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
        const jwt = JWT.create(member)

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${jwt}`,
        })
        res.end(JSON.stringify({
          jwt, member
        }))
        return
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