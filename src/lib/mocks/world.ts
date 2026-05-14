import { createWorld } from 'zod4-mock';
import {
	PersonSchema,
	ChangeSchema,
	MailSchema,
	RoleSchema,
	RoleNameSchema,
	PageMemberSchema,
	PagePersonDetailSchema,
	PageRoleSchema,
	PageHistorySchema,
	PageMailSchema
} from './schemas';

const ROLES = ['member', 'board', 'nerd', 'muzikant', 'im', 'klusser', 'wolpop'] as const;
const CITIES = ['Delft', 'Rotterdam', 'Den Haag', 'Utrecht', 'Leiden'] as const;
const MAIL_TEMPLATES = [
	'password-reset',
	'password-change-notification',
	'welcome'
] as const;

function fmtDate(d: Date): string {
	return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

function randomDate(year: number, span: number, prng: { int(a: number, b: number): number }): Date {
	return new Date(prng.int(year, year + span), prng.int(0, 11), prng.int(1, 28));
}

export const world = createWorld({ seed: 42 })
	.withSchema(RoleSchema, {
		matchers: {
			role: (ctx) => ROLES[ctx.prng.int(0, ROLES.length - 1)],
			since: (ctx) => fmtDate(randomDate(2015, 10, ctx.prng))
		}
	})
	.withSchema(PersonSchema, {
		matchers: {
			name: (ctx) => ctx.gen.person.firstName(),
			firstName: (ctx) => ctx.gen.person.firstName(),
			lastName: (ctx) => ctx.gen.person.lastName(),
			city: (ctx) => CITIES[ctx.prng.int(0, CITIES.length - 1)],
			country: () => 'Nederland',
			phone: (ctx) => `06-${ctx.prng.int(10_000_000, 99_999_999)}`
		}
	})
	.withSchema(ChangeSchema, {
		relations: { author: PersonSchema, subject: PersonSchema },
		matchers: {
			author: (ctx) => ctx.related('author').name as string,
			person: (ctx) => ctx.related('subject').name as string,
			fields: (ctx) => [
				{ field: 'email', old: null, new: ctx.gen.internet.email() },
				{
					field: 'phone',
					old: '06-12345678',
					new: `06-${ctx.prng.int(10_000_000, 99_999_999)}`
				}
			]
		}
	})
	.withSchema(MailSchema, {
		relations: { recipient: PersonSchema },
		matchers: {
			to: (ctx) => ctx.related('recipient').name as string,
			email: (ctx) => ctx.related('recipient').email as string
		}
	})
	/* ── Page-data schemas — match what each route's `load` returns ── */
	.withSchema(PageMemberSchema, {
		matchers: {
			name: (ctx) => ctx.gen.person.firstName(),
			firstname: (ctx) => ctx.gen.person.firstName(),
			lastname: (ctx) => ctx.gen.person.lastName(),
			email: (ctx) => ctx.gen.internet.email(),
			phone: (ctx) => `06-${ctx.prng.int(10_000_000, 99_999_999)}`,
			address: (ctx) => `${ctx.gen.location.street()} ${ctx.prng.int(1, 220)}`,
			city: (ctx) => CITIES[ctx.prng.int(0, CITIES.length - 1)],
			roles: (ctx) => {
				const count = ctx.prng.int(1, 3);
				const picked = new Set<string>(['member']);
				while (picked.size < count) picked.add(ROLES[ctx.prng.int(0, ROLES.length - 1)]);
				return [...picked].map((role) => ({ role }));
			}
		}
	})
	.withSchema(PagePersonDetailSchema, {
		matchers: {
			name: (ctx) => ctx.gen.person.firstName(),
			firstname: (ctx) => ctx.gen.person.firstName(),
			lastname: (ctx) => ctx.gen.person.lastName(),
			email: (ctx) => ctx.gen.internet.email(),
			phone: (ctx) => `06-${ctx.prng.int(10_000_000, 99_999_999)}`,
			address: (ctx) => `${ctx.gen.location.street()} ${ctx.prng.int(1, 220)}`,
			zipcode: (ctx) => `${ctx.prng.int(1000, 9999)} ${ctx.gen.string.alphanumeric(2).toUpperCase()}`,
			city: (ctx) => CITIES[ctx.prng.int(0, CITIES.length - 1)],
			country: () => 'Nederland',
			bankaccount: (ctx) => `NL${ctx.prng.int(10, 99)}WLBD${ctx.prng.int(1_000_000_000, 9_999_999_999)}`,
			key_code: (ctx) => String(ctx.prng.int(1000, 9999)),
			allow_register: (ctx) => ctx.prng.int(0, 1) === 1,
			allow_door: (ctx) => ctx.prng.int(0, 1) === 1,
			password: () => null,
			note: () => null,
			created: (ctx) => randomDate(2017, 6, ctx.prng),
			modified: (ctx) => randomDate(2024, 2, ctx.prng)
		}
	})
	.withSchema(PageRoleSchema, {
		matchers: {
			role: (ctx) => ROLES[ctx.prng.int(0, ROLES.length - 1)],
			valid_from: (ctx) => randomDate(2017, 6, ctx.prng),
			valid_till: () => null
		}
	})
	.withSchema(PageHistorySchema, {
		relations: { author: PersonSchema, subject: PersonSchema },
		matchers: {
			timestamp: (ctx) => randomDate(2025, 1, ctx.prng),
			role: () => null,
			author_id: (ctx) => ctx.prng.int(1, 40),
			person_id: (ctx) => ctx.prng.int(1, 40),
			author: (ctx) => ({ name: ctx.related('author').name as string }),
			person: (ctx) => ({ name: ctx.related('subject').name as string }),
			old_values: () => null,
			new_values: (ctx) => ({
				email: ctx.gen.internet.email(),
				phone: `06-${ctx.prng.int(10_000_000, 99_999_999)}`
			})
		}
	})
	.withSchema(PageMailSchema, {
		relations: { recipient: PersonSchema },
		matchers: {
			status: (ctx) => (ctx.prng.int(0, 1) === 1 ? 'sent' : 'new'),
			template: (ctx) => MAIL_TEMPLATES[ctx.prng.int(0, MAIL_TEMPLATES.length - 1)],
			created: (ctx) => randomDate(2026, 0, ctx.prng),
			personName: (ctx) => ctx.related('recipient').name as string,
			personEmail: (ctx) => ctx.related('recipient').email as string
		}
	});

export type {
	Person,
	Change,
	Mail,
	RoleName,
	PageMember,
	PagePersonDetail,
	PageRole,
	PageHistory,
	PageMail
} from './schemas';
export {
	PersonSchema,
	ChangeSchema,
	MailSchema,
	RoleSchema,
	RoleNameSchema,
	PageMemberSchema,
	PagePersonDetailSchema,
	PageRoleSchema,
	PageHistorySchema,
	PageMailSchema
};
