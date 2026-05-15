import { z } from 'zod';

// Mirrors the auth.person.is_email CHECK constraint, so server-side validation
// rejects what the DB would refuse anyway — no more 500s on bad email input.
const emailRe = /^\S+@([a-zA-Z0-9][a-zA-Z0-9-]*\.)+(xn--[a-zA-Z0-9-]{4,}|[a-zA-Z]{2,})$/;

const optionalString = (max: number) =>
	z
		.string()
		.trim()
		.max(max)
		.transform((v) => (v === '' ? null : v))
		.nullable()
		.default(null);

const personFields = {
	name: z.string().trim().min(1, 'required').max(255),
	firstname: optionalString(512),
	lastname: optionalString(512),
	email: z
		.string()
		.trim()
		.max(255)
		.transform((v) => (v === '' ? null : v))
		.nullable()
		.refine((v) => v === null || emailRe.test(v), { message: 'invalid email' })
		.default(null),
	phone: optionalString(255),
	address: optionalString(1024),
	zipcode: optionalString(255),
	city: optionalString(255),
	country: optionalString(255),
	bankaccount: optionalString(80),
	key_code: optionalString(80),
	allow_register: z.boolean().default(false),
	allow_door: z.boolean().default(false),
	note: z
		.string()
		.transform((v) => (v === '' ? null : v))
		.nullable()
		.default(null),
	password: z
		.string()
		.transform((v) => (v === '' ? null : v))
		.nullable()
		.refine((v) => v === null || v.length >= 8, { message: 'min 8 chars' })
		.default(null)
};

// Single shape used for both create (/m/+new) and edit (/m/[identifier]). The
// edit form always re-submits every field thanks to superforms' dataType: 'json',
// so a separate "partial" variant just made the bound types `string | undefined`.
export const PersonSchema = z.object(personFields);
export type PersonInput = z.infer<typeof PersonSchema>;
