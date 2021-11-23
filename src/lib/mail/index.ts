import { client, gql } from '$lib/graphql'

export { default as templates } from './templates'
export const send = (personId, template, data) => client.request(gql`
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
