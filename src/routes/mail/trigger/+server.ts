import nodemailer from 'nodemailer'
import mjml from 'mjml'
import { JSDOM } from 'jsdom'
import { graphql } from '$houdini'
import { error, json } from '@sveltejs/kit'

import type { RequestHandler } from './$types'
import { serverToken } from '$lib/jwt'

import { env } from '$env/dynamic/private'

import templates from '$lib/mail/templates'

// Try sending the mail, untill the moment the mail is really sent, we can still retry sending.
const transporter = nodemailer.createTransport({
  // sendmail: true,
  // newline: 'unix',
  // path: '/usr/sbin/sendmail',
  // args: ['-S', 'wlbd.nl']
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  auth: {
    type: 'login',
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
  secure: env.EMAIL_SECURE === 'true' || [465].includes(parseInt(env.EMAIL_PORT)), // true for 465, false for other ports
  tls: {
    rejectUnauthorized: false
  },
  debug: true
})

type TemplateKey = keyof typeof templates
const isTemplateKey = (key: string): key is TemplateKey => key in templates

const getEmail = graphql(`
  query getEmail($id: Int!) {
    mail: mail_entries_by_pk(id:$id) {
      data status template
      person {
        name email
      }
    }
  }
`);

const updateMail = graphql(`
  mutation updateMail($id:Int!, $messageInfo:jsonb!) {
    update_mail_entries_by_pk(pk_columns:{id:$id}, _set:{
      message_info: $messageInfo
    }) {
      id
    }
  }`)

const REHead = new RegExp('<!-- HEAD_svelte-irnrro_START -->(?<subject>.+)<!-- HEAD_svelte-irnrro_END -->')

export const POST = (async (event) => {
  const {
    event: {
      data: {
        new: { id },
      },
    },
  } = await event.request.json()

  console.log("Processing mail", id)

  const token = serverToken('mail')
  const { data } = await getEmail.fetch({
    variables: { id },
    event,
    metadata: { token }
  })

  if (!data || !data?.mail) {
    throw error(400, `unprocessable mail ${id}`)
  }

  if (!data.mail.person.email) {
    throw error(400, `No email for user '${data.mail.person.name}' known`)
  }
  console.log(`Sending mail: ${data.mail.template} to ${data.mail.person.email}`)

  // Render mail template
  if (!isTemplateKey(data.mail.template)) {
    throw error(400, `Template '${data.mail.template}' not found`)
  }
  const template = templates[data.mail.template]

  const { html: mjmlTemplate, head } = template.default.render(data.mail)
  const { subject = 'Email from Wolbodo' } = REHead.exec(head)?.groups ?? {}

  const output = mjml(mjmlTemplate)

  if (output.errors.length) {
    console.log("Errors in mjml rendering:", output.errors)
  }

  const text = new JSDOM(output.html).window.document.body.textContent

  const mailOptions = {
    from: '"Wolbodo" <it@wolbodo.nl>', // sender address
    to: data.mail.person.email,
    subject,
    text: text?.trim(),
    html: output.html,
  }
  const messageInfo = await transporter.sendMail(mailOptions)

  console.log('Done mailing', id, messageInfo)

  await updateMail.mutate({
    id, messageInfo
  }, { event, metadata: { token } })

  return json({
    mail: id
  })
}) satisfies RequestHandler