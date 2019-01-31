
"use strict";
import nodemailer from "nodemailer"
import mails from 'src/mails'
import { JSDOM } from 'jsdom'

// async..await is not allowed in global scope, must use a wrapper
export async function get (req, res) {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail",
    port: 1025,
    secure: false, // true for 465, false for other ports
  });

  const { html, head } = mails.test.render({ name: 'Dingo'}) 

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
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject, text, html
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));



  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify({
    status: 'ok'
  }))
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

