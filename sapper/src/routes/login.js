import bcrypt from 'bcryptjs'
import createClient, { createServerLink } from '../lib/graphql'
import createJWT from '../lib/jwt'

const token = createJWT({
  id: -1,
  name: 'login',
  user_roles: [
    { role: { name: 'login'}}
  ]
}, 'login');


const client = createClient(createServerLink('http://graphql/v1alpha1/graphql', token))
import gql from 'graphql-tag';



export async function post(req, res, next) {
  try {
    const result = await client.query({
      query: gql`
        query($email: String) {
          account_user(where:{email:{_eq:$email}}) {
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
    const { account_user: [user, ] } = result.data

    console.log("Got post in login:", req.body, user, token)
    if (user) {
      console.log("Here", req.body.password, user.password)

      const passwordOk = await bcrypt.compare(req.body.password, user.password)
        
      if (passwordOk) {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({
          jwt: createJWT(user)
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