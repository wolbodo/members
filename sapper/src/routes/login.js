import bcrypt from 'bcrypt'
import createClient from './_lib/graphql'
import createJWT from './_lib/jwt'

const client = createClient('http://members-graphql-1.dev.dock/v1alpha1/graphql')
import gql from 'graphql-tag';


export async function post(req, res, next) {

  const result = await client.query({
    query: gql`
      query($username: String) {
        user(where:{name:{_eq:$username}}) {
          id name password
          user_roles {
            role {
              name
            }
          }
        }
      }
    `,
    variables: {
      username: req.body.username
    }
  })
  const { user: [user, ] } = result.data

  console.log("Got post in login:", req.body)
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })

  const passwordOk = await bcrypt.compare(req.body.password, user.password)

  if (passwordOk) {
    res.end(JSON.stringify({
      jwt: createJWT(user),
    }))
  } else {
    res.end()
  }

}