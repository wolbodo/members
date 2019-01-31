import gql from 'graphql-tag'
import nodemailer from "nodemailer"
import { JSDOM } from 'jsdom'

import { create } from 'src/lib/jwt'
import mails from 'src/mails'
import createStore from 'src/stores'

const { GRAPHQL_LOCAL_URI } = process.env;

// async..await is not allowed in global scope, must use a wrapper
export async function post (req, res) {

  const data = req.body
  console.log("Data:",data)
  const _mail = data.event.data.new

  const token = create({
    id: -1,
    name: 'mail',
    member_roles: [
      { role: { name: 'mail' } }
    ]
  }, 'mail') 
  const store = createStore({
    graphqlUri: GRAPHQL_LOCAL_URI,
    token,
    role: 'mail'
  })

  const { data: { mail }} = await store.gqlQuery({
    query: gql`query getMail($id: Int!) {
      mail: mail_by_pk(id:$id) {
        id data status template member {
          name email fullname
        }
      }
    }`,
    variables: {
      id: _mail.id
    }
  })
  console.log("Got mail:", mail)

  if (mail.status !== 'new') {
    throw new Error("Mail already sent")
  }

  try {

    let transporter = nodemailer.createTransport({
      host: "mail",
      port: 1025,
      secure: false, // true for 465, false for other ports
    });

    const { html, head } = mails[mail.template].render({
      user: mail.member,
      ...mail.data
    }) 

    // Parse the head to get the subject and text
    const dom = new JSDOM(head);
    const subjectEl = dom.window.document.querySelector("title")

    const subject = subjectEl.textContent || ''
    const text = dom.window.document.body.textContent.trim()

    subjectEl.remove()
    console.log({
      subject, text
    }); // "Hello world"

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Wolbodo members system" <admin@wolbodo.nl>', // sender address
      to: mail.member.email,
      subject, text, html
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions)


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

    console.log("Message sent: %s", info.messageId, mutRes);


    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify({
      status: 'ok'
    }))
  } catch (e) {
    console.error("Error happened in sending mail:", e)

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
}

