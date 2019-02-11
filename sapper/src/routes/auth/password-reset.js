import gql from 'graphql-tag'

import { serverToken } from 'src/lib/jwt'
import * as JWT from 'src/lib/jwt'
import createStore from 'src/stores'
import bcrypt from 'bcryptjs'

const { GRAPHQL_LOCAL_URI } = process.env;

export async function post(req, res) {
  const store = createStore({
    graphqlUri: GRAPHQL_LOCAL_URI,
    token: serverToken('server:password-reset', 'server'),
    role: 'server'
  })

  const { password, token: resetToken } = req.body

  try {

    // Only raise error if pass wasnt set
    console.log("Fetching mail")
    // Find the mail
    const {
      data: {
        mail: [ mail, ]
      } 
    } = await store.gqlQuery({
      query: gql`
        query mailByToken($filter: jsonb!) {
          mail(where:{
            data:{
              _contains:$filter
            }
          }) {
            id data member {
              id password
            }
          }
        }
      `,
      variables: {
        filter: {
          resetToken
        }
      }
    })
    console.log("Got mailres:", mail)

    // Verify token, 
    const isValid = await bcrypt.compare(`${mail.member.password}${mail.data.timestamp}`, resetToken)

    console.log("Token valid:", isValid)
    if (!isValid) {
      throw new Error("Token outdated")
    }

    // Change password
    await store.gqlMutation({
      mutation: gql`
        mutation changePassword($id: Int!, $password:String!){
          update_member(
            _set: { password: $password },
            where:{ id: { _eq: $id }}
          ) {
            affected_rows
          }
        }`,
      variables: {
        id: mail.member.id,
        password: password
      }
    })

    res.writeHead(200)
    res.end()
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