import { z } from 'zod';

export const RoleNameSchema = z.enum([
	'member',
	'board',
	'nerd',
	'muzikant',
	'im',
	'klusser',
	'wolpop',
	'schoonmaker',
	'server'
]);
export type RoleName = z.infer<typeof RoleNameSchema>;

export const RoleSchema = z.object({
	role: RoleNameSchema,
	since: z.string()
});

export const PersonSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	phone: z.string(),
	address: z.string().nullable(),
	city: z.string().nullable(),
	country: z.string().nullable(),
	roles: z.array(RoleSchema).min(1).max(4),
	createdAt: z.date()
});
export type Person = z.infer<typeof PersonSchema>;

export const ChangeFieldSchema = z.object({
	field: z.string(),
	old: z.string().nullable(),
	new: z.string().nullable()
});

export const ChangeSchema = z.object({
	id: z.string(),
	time: z.date(),
	author: z.string(),
	person: z.string(),
	role: RoleNameSchema.optional(),
	fields: z.array(ChangeFieldSchema).min(1).max(4)
});
export type Change = z.infer<typeof ChangeSchema>;

export const MailSchema = z.object({
	id: z.string(),
	status: z.enum(['pending', 'sent']),
	to: z.string(),
	email: z.string().email(),
	template: z.enum(['password-reset', 'password-change-notification', 'welcome']),
	time: z.date()
});
export type Mail = z.infer<typeof MailSchema>;

/* ───────────────────────────────────────────────────────────────
   Page-data schemas — mirror what each route's `load` returns,
   so page stories can render the real `+page.svelte` components.
   ─────────────────────────────────────────────────────────────── */

/** A row from the members list `+page.server.ts` `enriched` array. */
export const PageMemberSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	firstname: z.string().nullable(),
	lastname: z.string().nullable(),
	email: z.string().nullable(),
	phone: z.string().nullable(),
	address: z.string().nullable(),
	zipcode: z.string().nullable(),
	city: z.string().nullable(),
	country: z.string().nullable(),
	bankaccount: z.string().nullable(),
	key_code: z.string().nullable(),
	allow_register: z.boolean(),
	allow_door: z.boolean(),
	password: z.string().nullable(),
	note: z.string().nullable(),
	created: z.date().nullable(),
	modified: z.date().nullable(),
	roles: z.array(z.string())
});
export type PageMember = z.infer<typeof PageMemberSchema>;

/** The redacted `person` row from the member-detail route. */
export const PagePersonDetailSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	firstname: z.string().nullable(),
	lastname: z.string().nullable(),
	email: z.string().nullable(),
	phone: z.string().nullable(),
	address: z.string().nullable(),
	zipcode: z.string().nullable(),
	city: z.string().nullable(),
	country: z.string().nullable(),
	bankaccount: z.string().nullable(),
	key_code: z.string().nullable(),
	allow_register: z.boolean(),
	allow_door: z.boolean(),
	password: z.string().nullable(),
	note: z.string().nullable(),
	created: z.date().nullable(),
	modified: z.date().nullable()
});
export type PagePersonDetail = z.infer<typeof PagePersonDetailSchema>;

/** A `personRole` row as returned to the member-detail route. */
export const PageRoleSchema = z.object({
	id: z.number().int().positive(),
	person_id: z.number().int().positive().nullable(),
	role: z.string(),
	valid_from: z.date().nullable(),
	valid_till: z.date().nullable()
});
export type PageRole = z.infer<typeof PageRoleSchema>;

/** A history entry as returned by the changes route (`historyWithNames`). */
export const PageHistorySchema = z.object({
	id: z.number().int().positive(),
	timestamp: z.date(),
	new_values: z.record(z.string(), z.string()).nullable(),
	old_values: z.record(z.string(), z.string()).nullable(),
	role: z.string().nullable(),
	author_id: z.number().int().positive().nullable(),
	person_id: z.number().int().positive().nullable(),
	author: z.object({ name: z.string() }).nullable(),
	person: z.object({ name: z.string() }).nullable()
});
export type PageHistory = z.infer<typeof PageHistorySchema>;

/** A mail entry as returned by the mail route. */
export const PageMailSchema = z.object({
	id: z.number().int().positive(),
	status: z.enum(['new', 'sent', 'error', 'sending']).nullable(),
	template: z.string(),
	created: z.date().nullable(),
	personName: z.string(),
	personEmail: z.string().nullable()
});
export type PageMail = z.infer<typeof PageMailSchema>;
