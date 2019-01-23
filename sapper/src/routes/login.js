import bcrypt from 'bcryptjs'
import * as JWT from '../lib/jwt'

import createStore from '../stores'
import gql from 'graphql-tag';


export async function post(req, res, next) {
  const store = createStore()
  const token = JWT.create({
    id: -1,
    name: 'login',
    user_roles: [
      { role: { name: 'login'}}
    ]
  }, 'login');
  const client = store.getServerClient('http://graphql/v1alpha1/graphql', token, 'login')


  try {
    console.log("Trying query")
    const result = await client.query({
      query: gql`
        query($email: String) {
          active_member(where:{email:{_eq:$email}}) {
            id email password
            user_roles {
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
    console.log("Has received result:", result)
    const { active_member: [member, ] } = result.data

    console.log("Got post in login:", req.body, member, token)
    if (member) {
      console.log("Here", req.body.password, member.password)

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
    console.error('Hmm', e)
    res.writeHead(500, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify({
      error: e.toString()
    }))
  }
}