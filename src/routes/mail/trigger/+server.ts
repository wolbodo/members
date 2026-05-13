import nodemailer from 'nodemailer';
import mjml from 'mjml';
import { Window } from 'happy-dom';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { mailEntries, person } from '$lib/server/schema';
import templates from '$lib/mail/templates';

const transporter = nodemailer.createTransport({
	host: env.EMAIL_HOST,
	port: env.EMAIL_PORT,
	auth: { type: 'login', user: env.EMAIL_USER, pass: env.EMAIL_PASS },
	secure: env.EMAIL_SECURE === 'true' || [465].includes(parseInt(env.EMAIL_PORT)),
	tls: { rejectUnauthorized: false },
	debug: true
});

type TemplateKey = keyof typeof templates;
const isTemplateKey = (key: string): key is TemplateKey => key in templates;

const RE_HEAD = /<!-- HEAD_svelte-irnrro_START -->(?<subject>.+)<!-- HEAD_svelte-irnrro_END -->/;

const window = new Window();

export const POST = (async (event) => {
	const body = await event.request.json();
	const id: number = body.event.data.new.id;

	console.log('Processing mail', id);

	const [entry] = await db
		.select({
			data: mailEntries.data,
			status: mailEntries.status,
			template: mailEntries.template,
			personName: person.name,
			personEmail: person.email
		})
		.from(mailEntries)
		.innerJoin(person, eq(mailEntries.person_id, person.id))
		.where(eq(mailEntries.id, id))
		.limit(1);

	if (!entry) error(400, `unprocessable mail ${id}`);
	if (!entry.personEmail) error(400, `No email for user '${entry.personName}' known`);

	console.log(`Sending mail: ${entry.template} to ${entry.personEmail}`);

	if (!isTemplateKey(entry.template)) error(400, `Template '${entry.template}' not found`);

	const template = templates[entry.template];
	const { html: mjmlTemplate, head } = template.default.render(entry);
	const { subject = 'Email from Wolbodo' } = RE_HEAD.exec(head)?.groups ?? {};

	const output = mjml(mjmlTemplate);
	if (output.errors.length) console.log('Errors in mjml rendering:', output.errors);

	window.document.body.innerHTML = output.html;
	const text = window.document.body.textContent;

	const messageInfo = await transporter.sendMail({
		from: '"Wolbodo" <it@wolbodo.nl>',
		to: entry.personEmail,
		subject,
		text: text?.trim(),
		html: output.html
	});

	console.log('Done mailing', id, messageInfo);

	await db
		.update(mailEntries)
		.set({ message_info: messageInfo as Record<string, unknown> })
		.where(eq(mailEntries.id, id));

	return json({ mail: id });
}) satisfies RequestHandler;
