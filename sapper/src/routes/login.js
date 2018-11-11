
import createClient from './_lib/graphql'
import createJWT from './_lib/jwt'

const client = createClient('http://auth-graphql-1.auth.dock/v1alpha1/graphql')
import gql from 'graphql-tag';


export async function post(req, res, next) {

  const result = await client.query({
    query: gql`
      query($username: String) {
        user(where:{name:{_eq:$username}}) {
          id name
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

  res.end(JSON.stringify({
    ...req.body,
    jwt: createJWT({
      id: 1,
      name: 'teset'
    }),
    user
  }))
}