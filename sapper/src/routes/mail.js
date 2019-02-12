import gql from 'graphql-tag'
import nodemailer from 'nodemailer'
import { JSDOM } from 'jsdom'

import { serverToken } from 'src/lib/jwt'
import mails from 'src/mails'
import createStore from 'src/stores'

const { GRAPHQL_LOCAL_URI } = process.env

// async..await is not allowed in global scope, must use a wrapper
export async function post (req, res) {
  const data = req.body
  const _mail = data.event.data.new

  const store = createStore({
    graphqlUri: GRAPHQL_LOCAL_URI,
    token: serverToken('server:mail', 'server'),
    role: 'server'
  })

  console.log('Querying mail:', _mail.id)
  const { data: { mail }} = await store.gqlQuery({
    query: gql`query getMail($id: Int!) {
      mail: mail_by_pk(id:$id) {
        id data status template member {
          name email name
        }
      }
    }`,
    variables: {
      id: _mail.id
    }
  })
  console.log('Got mail:', mail)
  let messageInfo

  if (mail && mail.status === 'new') {
    // Do not retry new mails
    try {
      // Try sending the mail, untill the moment the mail is really sent, we can still retry sending.
      let transporter = nodemailer.createTransport({
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail',
        args: ['-S', 'wlbd.nl']
        // host: 'mail',

        // port: 1025,
        // secure: false // true for 465, false for other ports
      })

      console.log('Created mailtransport')

      const { html, head } = mails[mail.template].render({
        user: mail.member,
        ...mail.data
      })
      console.log('Rendered template')

      // Parse the head to get the subject and text
      const dom = new JSDOM(head)
      const subjectEl = dom.window.document.querySelector('title')

      const subject = subjectEl.textContent || ''
      const text = dom.window.document.body.textContent.trim()

      subjectEl.remove()

      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Wolbodo members system" <admin@wolbodo.nl>', // sender address
        to: mail.member.email,
        subject,
        text,
        html
      }

      console.log('Sending mail')
      // send mail with defined transport object
      messageInfo = await transporter.sendMail(mailOptions)
    } catch (e) {
      console.error('Error happened in sending mail:', e)

      await store.gqlMutation({
        mutation: gql`mutation mailError($id: Int!) {
          update_mail(_set:{status: "error"}, where:{id:{_eq:$id}}) {
            affected_rows
          }
        }`,
        variables: {
          id: _mail.id
        }
      })

      res.writeHead(500, {
        'Content-Type': 'application/json'
      })
      res.end(JSON.stringify({
        error: e
      }))
    }

    console.log('Updating mail table', _mail.id, messageInfo)
    const mutRes = await store.gqlMutation({
      mutation: gql`mutation mailSent($id: Int!) {
        update_mail(_set:{status: "sent"}, where:{id:{_eq:$id}}) {
          affected_rows
        }
      }`,
      variables: {
        id: _mail.id
      }
    })

    console.log('Message sent: %s', messageInfo.messageId, mutRes)
  }

  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify({
    status: 'ok',
    sent: !!(messageInfo && messageInfo.messageId)
  }))
}
