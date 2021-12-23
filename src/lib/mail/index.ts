import { gql, GraphQLClient } from 'graphql-request'

import { serverToken } from '$lib/jwt'
import { GRAPHQL_ENDPOINT } from '$lib/config'

const client = new GraphQLClient(GRAPHQL_ENDPOINT)

export { default as templates } from './templates'
export const send = (personId, template, data) => {
  client.setHeader('authorization', `Bearer ${serverToken('send-mail')}`)
  client.request(gql`
    mutation sendMail($template:String!, $personId:Int!, $data:jsonb = {}) {
      insert_mail_entries_one(object:{
        data:$data,
        template:$template,
        person_id:$personId
      }) {
        id
      }
    }
    `, {
    personId, template, data
  })
}