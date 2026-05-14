import {
	pgSchema,
	serial,
	varchar,
	integer,
	boolean,
	text,
	timestamp,
	jsonb,
	uuid,
	index,
	check
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const auth = pgSchema('auth');
const mail = pgSchema('mail');

export const mailStatus = mail.enum('status', ['new', 'sent', 'error', 'sending']);

export const person = auth.table(
	'person',
	{
		id: serial('id').primaryKey(),
		name: varchar('name', { length: 255 }).notNull(),
		firstname: varchar('firstname', { length: 512 }),
		lastname: varchar('lastname', { length: 512 }),
		email: varchar('email', { length: 255 }).unique(),
		phone: varchar('phone', { length: 255 }),
		address: varchar('address', { length: 1024 }),
		zipcode: varchar('zipcode', { length: 255 }),
		city: varchar('city', { length: 255 }),
		country: varchar('country', { length: 255 }),
		bankaccount: varchar('bankaccount', { length: 80 }),
		key_code: varchar('key_code', { length: 80 }),
		allow_register: boolean('allow_register').default(false).notNull(),
		allow_door: boolean('allow_door').default(false).notNull(),
		password: varchar('password', { length: 1024 }),
		note: text('note'),
		created: timestamp('created', { withTimezone: true }).defaultNow(),
		modified: timestamp('modified', { withTimezone: true }).defaultNow()
	},
	(t) => ({
		emailIdx: index('person_email_idx').on(t.email),
		idIdx: index('person_id_idx').on(t.id),
		emailCheck: check(
			'is_email',
			sql`${t.email} ~ '^\\S+?@([a-zA-Z0-9][a-zA-Z0-9-]*\\.)+(xn--[a-zA-Z0-9-]{4,}|[a-zA-Z]{2,})$'`
		)
	})
);

export const personRole = auth.table(
	'person_role',
	{
		id: serial('id').primaryKey(),
		person_id: integer('person_id').references(() => person.id, { onDelete: 'cascade' }),
		role: varchar('role').notNull(),
		valid_from: timestamp('valid_from', { withTimezone: true }).defaultNow(),
		valid_till: timestamp('valid_till', { withTimezone: true })
	},
	(t) => ({
		personIdx: index('person_role_person_id_idx').on(t.person_id)
	})
);

export const history = auth.table('history', {
	id: serial('id').primaryKey(),
	timestamp: timestamp('timestamp'),
	old_values: jsonb('old_values'),
	new_values: jsonb('new_values'),
	role: varchar('role'),
	author_id: integer('author_id').references(() => person.id),
	person_id: integer('person_id').references(() => person.id, { onDelete: 'set null' })
});

export const application = auth.table('application', {
	name: text('name').primaryKey(),
	role: text('role').notNull(),
	secret: uuid('secret').defaultRandom().notNull()
});

export const mailEntries = mail.table('entries', {
	id: serial('id').primaryKey(),
	person_id: integer('person_id')
		.notNull()
		.references(() => person.id),
	status: mailStatus('status').default('new'),
	template: varchar('template', { length: 255 }).notNull(),
	created: timestamp('created', { withTimezone: true }).defaultNow(),
	data: jsonb('data').default({}),
	message_info: jsonb('message_info').default({})
});

export type Person = typeof person.$inferSelect;
export type PersonRole = typeof personRole.$inferSelect;
export type MailEntry = typeof mailEntries.$inferSelect;
