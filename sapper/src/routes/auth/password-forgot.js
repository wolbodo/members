import gql from 'graphql-tag'
import bcrypt from 'bcryptjs'
import moment from 'moment'

import { serverToken } from 'src/lib/jwt'
import createStore from 'src/stores'

const { GRAPHQL_LOCAL_URI } = process.env;

export async function post(req, res) {
  const store = createStore({
    graphqlUri: GRAPHQL_LOCAL_URI,
    token: serverToken('server:password-forgot', 'server'),
    role: 'server'
  })

  try {
    const result = await store.gqlQuery({
      query: gql`
        query($email: String) {
          active_member(where:{email:{_eq:$email}}) {
            id password
          }
        }
      `,
      variables: {
        email: req.body.email
      }
    })
    const { active_member: [member, ] } = result.data

    console.log("Got member:", member)
    if (member) {
      // Create a token and create an email -> Redirect user to success page
      const timestamp = moment().unix()
      const resetToken = bcrypt.hashSync(`${member.password}${timestamp}`, 8)

      const mailResult = await store.gqlMutation({
        mutation: gql`
          mutation createPasswordReset ($memberId: Int!, $data: jsonb!) {
            insert_mail(
              objects: {
                member_id: $memberId,
                template: "password-reset",
                data: $data
              }
            ) {
              affected_rows
            }
          }
        `,
        variables: {
          memberId: member.id,
          data: {
            resetToken,
            timestamp,
            link: `https://members.wlbd.nl/login/reset-password?token=${resetToken}`
          }
        }
      })

      console.log("QS:", mailResult)
    }
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