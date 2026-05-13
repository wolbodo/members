import { pgSchema, serial, varchar, integer, boolean, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

const auth = pgSchema('auth');
const mail = pgSchema('mail');

export const person = auth.table('person', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	firstname: varchar('firstname', { length: 255 }),
	lastname: varchar('lastname', { length: 255 }),
	email: varchar('email', { length: 255 }),
	phone: varchar('phone', { length: 50 }),
	address: varchar('address', { length: 255 }),
	zipcode: varchar('zipcode', { length: 20 }),
	city: varchar('city', { length: 100 }),
	country: varchar('country', { length: 100 }),
	bankaccount: varchar('bankaccount', { length: 100 }),
	key_code: integer('key_code'),
	allow_register: boolean('allow_register').default(false),
	allow_door: boolean('allow_door').default(false),
	password: varchar('password', { length: 255 }),
	note: text('note'),
	created: timestamp('created', { withTimezone: true }).defaultNow(),
	modified: timestamp('modified', { withTimezone: true }).defaultNow()
});

export const personRole = auth.table('person_role', {
	id: serial('id').primaryKey(),
	person_id: integer('person_id').references(() => person.id),
	role: varchar('role', { length: 50 }).notNull(),
	valid_from: timestamp('valid_from', { withTimezone: true }).defaultNow(),
	valid_till: timestamp('valid_till', { withTimezone: true })
});

export const history = auth.table('history', {
	id: serial('id').primaryKey(),
	timestamp: timestamp('timestamp', { withTimezone: true }),
	old_values: jsonb('old_values'),
	new_values: jsonb('new_values'),
	role: varchar('role', { length: 100 }),
	author_id: integer('author_id'),
	person_id: integer('person_id')
});

export const application = auth.table('application', {
	name: varchar('name', { length: 100 }).primaryKey(),
	role: varchar('role', { length: 50 }).notNull(),
	secret: varchar('secret', { length: 255 }).notNull()
});

export const mailEntries = mail.table('entries', {
	id: serial('id').primaryKey(),
	person_id: integer('person_id').references(() => person.id),
	status: varchar('status', { length: 50 }),
	template: varchar('template', { length: 100 }).notNull(),
	created: timestamp('created', { withTimezone: true }).defaultNow(),
	data: jsonb('data'),
	message_info: jsonb('message_info')
});

export type Person = typeof person.$inferSelect;
export type PersonRole = typeof personRole.$inferSelect;
export type MailEntry = typeof mailEntries.$inferSelect;
