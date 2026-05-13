import nodemailer from 'nodemailer';
import { render } from 'svelte/server';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { mailEntries, person } from '$lib/server/schema';
import templates from '$lib/mail/templates';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transporter = nodemailer.createTransport({
	host: env.EMAIL_HOST,
	port: env.EMAIL_PORT,
	auth: { type: 'login', user: env.EMAIL_USER, pass: env.EMAIL_PASS },
	secure: env.EMAIL_SECURE === 'true' || [465].includes(parseInt(env.EMAIL_PORT)),
	tls: { rejectUnauthorized: false },
	debug: true
} as any);

type TemplateKey = keyof typeof templates;
const isTemplateKey = (key: string): key is TemplateKey => key in templates;

const stripHtml = (html: string): string => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

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
	const props = { person: { name: entry.personName }, data: entry.data };
	const { body: html, head } = render(template.default, { props });

	const subjectMatch = /<title>([^<]+)<\/title>/.exec(head);
	const subject = subjectMatch?.[1] ?? 'Email from Wolbodo';

	const messageInfo = await transporter.sendMail({
		from: '"Wolbodo" <it@wolbodo.nl>',
		to: entry.personEmail,
		subject,
		text: stripHtml(html),
		html
	});

	console.log('Done mailing', id, messageInfo);

	await db
		.update(mailEntries)
		.set({ message_info: messageInfo as unknown as Record<string, unknown> })
		.where(eq(mailEntries.id, id));

	return json({ mail: id });
}) satisfies RequestHandler;
