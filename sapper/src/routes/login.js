import bcrypt from 'bcryptjs'
import createClient from '../lib/graphql'
import createJWT from '../lib/jwt'

const token = createJWT({
  id: -1,
  name: 'login',
  user_roles: [
    { role: { name: 'login'}}
  ]
});


const client = createClient('http://graphql/v1alpha1/graphql', token)
import gql from 'graphql-tag';


export async function post(req, res, next) {

  const result = await client.query({
    query: gql`
      query($email: String) {
        account_user(where:{name:{_eq:$email}}) {
          email password
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
  const { user: [user, ] } = result.data

  console.log("Got post in login:", req.body, user)
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
}