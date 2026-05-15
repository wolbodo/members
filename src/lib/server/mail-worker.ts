import nodemailer, { type Transporter } from 'nodemailer';
import { render } from 'svelte/server';
import { eq, and } from 'drizzle-orm';

import { env } from '$env/dynamic/private';
import { db, client } from '$lib/server/db';
import { mailEntries, person } from '$lib/server/schema';
import templates from '$lib/mail/templates';

type TemplateKey = keyof typeof templates;
const isTemplateKey = (key: string): key is TemplateKey => key in templates;

export const stripHtml = (html: string): string =>
	html
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

export type RenderedMessage = { subject: string; html: string; text: string };

export const buildMessage = (
	templateKey: string,
	props: { person: { name: string }; data: unknown }
): RenderedMessage => {
	if (!isTemplateKey(templateKey)) throw new Error(`unknown template '${templateKey}'`);
	const { body: html, head } = render(templates[templateKey].default, {
		props
	});
	// svelte-email emits <title> into the body via its own <Head>; svelte/server
	// only fills `head` when <svelte:head> is used. Search both.
	const subject = /<title>([^<]+)<\/title>/.exec(head + html)?.[1] ?? 'Email from Wolbodo';
	return { subject, html, text: stripHtml(html) };
};

let _transporter: Transporter | null = null;
const getTransporter = (): Transporter => {
	if (_transporter) return _transporter;
	const port = parseInt(env.EMAIL_PORT ?? '587');
	_transporter = nodemailer.createTransport({
		host: env.EMAIL_HOST,
		port,
		auth: { type: 'login', user: env.EMAIL_USER, pass: env.EMAIL_PASS },
		secure: env.EMAIL_SECURE === 'true' || port === 465,
		tls: { rejectUnauthorized: false }
	} as Parameters<typeof nodemailer.createTransport>[0]);
	return _transporter;
};

export const processMail = async (
	id: number,
	deps: { transporter?: Transporter } = {}
): Promise<void> => {
	console.log('Processing email', id);
	// Claim the row atomically — only one worker can pick up an unsent entry.
	// Guarded: a DB failure here (e.g. schema drift) must not crash the process,
	// since callers fire this off with `void`.
	let claimed: { id: number } | undefined;
	try {
		[claimed] = await db
			.update(mailEntries)
			.set({ status: 'sending' })
			.where(and(eq(mailEntries.id, id), eq(mailEntries.status, 'new')))
			.returning({ id: mailEntries.id });
	} catch (err) {
		console.error(`mail ${id}: could not claim row:`, err);
		return;
	}

	if (!claimed) return;

	try {
		const [entry] = await db
			.select({
				data: mailEntries.data,
				template: mailEntries.template,
				personName: person.name,
				personEmail: person.email
			})
			.from(mailEntries)
			.innerJoin(person, eq(mailEntries.person_id, person.id))
			.where(eq(mailEntries.id, id))
			.limit(1);

		if (!entry) throw new Error(`mail ${id}: row vanished`);
		if (!entry.personEmail) throw new Error(`mail ${id}: no email for ${entry.personName}`);

		const message = buildMessage(entry.template, {
			person: { name: entry.personName },
			data: entry.data
		});

		const transporter = deps.transporter ?? getTransporter();
		const messageInfo = await transporter.sendMail({
			from: env.EMAIL_FROM ?? '"Wolbodo" <it@wolbodo.nl>',
			to: entry.personEmail,
			...message
		});

		await db
			.update(mailEntries)
			.set({
				status: 'sent',
				message_info: messageInfo as unknown as Record<string, unknown>
			})
			.where(eq(mailEntries.id, id));
	} catch (err) {
		console.error(`mail ${id} failed:`, err);
		// Guard the status write too — if it throws, the rejection would be
		// unhandled (callers use `void`) and crash the process.
		await db
			.update(mailEntries)
			.set({
				status: 'error',
				message_info: {
					error: err instanceof Error ? err.message : String(err)
				}
			})
			.where(eq(mailEntries.id, id))
			.catch((markErr) => console.error(`mail ${id}: could not mark as error:`, markErr));
	}
};

let started = false;

export const startMailWorker = async (): Promise<void> => {
	if (started) return;
	started = true;

	// Catch-up sweep — anything queued while the worker was down.
	const pending = await db
		.select({ id: mailEntries.id })
		.from(mailEntries)
		.where(eq(mailEntries.status, 'new'));

	for (const { id } of pending) void processMail(id);

	await client.listen('mail_entries_new', (payload) => {
		const id = parseInt(payload ?? '');
		if (Number.isFinite(id)) void processMail(id);
	});

	console.log(`Mail worker listening (caught up ${pending.length} pending)`);
};
