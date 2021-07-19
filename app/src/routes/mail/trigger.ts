import nodemailer from 'nodemailer'
import mjml from 'mjml'
import { JSDOM } from 'jsdom'

import { serverToken } from '$lib/jwt'
import { client, token, gql } from '$lib/graphql'

import templates from '$lib/mail/templates'

// Try sending the mail, untill the moment the mail is really sent, we can still retry sending.
const transporter = nodemailer.createTransport({
  // sendmail: true,
  // newline: 'unix',
  // path: '/usr/sbin/sendmail',
  // args: ['-S', 'wlbd.nl']
  host: process.env['EMAIL_HOST'],
  port: process.env['EMAIL_PORT'],
  auth: {
    type: 'login',
    user: process.env['EMAIL_USER'],
    pass: process.env['EMAIL_PASS'],
  },
  secure: process.env['EMAIL_SECURE'] === 'true' || [465].includes(parseInt(process.env['EMAIL_PORT'])), // true for 465, false for other ports
  tls: {
    rejectUnauthorized: false
  },
  debug: true
})

export async function post({ body }) {
  const {
    event: {
      data: {
        new: { id },
      },
    },
  } = body  

	const _token = serverToken('mail')
	token.set(_token)
  console.log("Mail:", id, _token)

  const { mail } = await client.request(gql`
    query getEmail($id: Int!) {
      mail: mail_entries_by_pk(id:$id) {
        data status template
        person {
          name email
        }
      }
    }
  `, { id })

  if (!mail.person.email) {
    throw new Error(`No email for user '${mail.person.name}' known`)
  }
  console.log(`Sending mail: ${mail.template} to ${mail.person.email}`)

  // Render mail template
  const template = templates[mail.template]

  if (!template) {
    throw new Error(`Template '${mail.template}' not found`)
  }

  const { html: mjmlTemplate, head } = template.default.render(mail)
  const output = mjml(mjmlTemplate)
  
  if (output.errors.length) {
    console.log("Errors in mjml rendering:", output.errors)
  }

  const mailOptions = {
    from: '"Wolbodo" <bot@wolbodo.nl>', // sender address
    to: mail.person.email,
    subject: head.trim(),
    text: new JSDOM(output.html).window.document.body.textContent.trim(),
    html: output.html,
  }
  const messageInfo = await transporter.sendMail(mailOptions)

  console.log('Done mailing', id, messageInfo)

  await client.request(gql`
    mutation updateMail($id:Int!, $messageInfo:jsonb!) {
      update_mail_entries_by_pk(pk_columns:{id:$id}, _set:{
        message_info: $messageInfo
      }) {
        id
      }
    }
  `, {
    id,
    messageInfo,
  })

  return {
    status: 200,
    body: {
      mail: id
    }
  }
}