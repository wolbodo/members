import { redirect, fail, type Actions } from '@sveltejs/kit';
import { person } from '$lib/server/schema';
import { withAuditContext } from '$lib/server/audit';

type PersonInsert = Omit<typeof person.$inferInsert, 'id' | 'created' | 'modified'>;

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();

		const raw = Object.fromEntries(
			Array.from(data.entries())
				.filter(([, value]) => Boolean(value))
				.map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
		) as Record<string, string>;

		const insert: PersonInsert = {
			name: raw.name,
			firstname: raw.firstname,
			lastname: raw.lastname,
			email: raw.email,
			phone: raw.phone,
			address: raw.address,
			zipcode: raw.zipcode,
			city: raw.city,
			country: raw.country,
			bankaccount: raw.bankaccount,
			key_code: raw.key_code || null,
			allow_register: raw.allow_register === 'on',
			allow_door: raw.allow_door === 'on',
			password: raw.password || null,
			note: raw.note || null
		};

		const created = await withAuditContext(event, async (tx) => {
			const [row] = await tx.insert(person).values(insert).returning({ id: person.id });
			return row;
		});

		if (!created) return fail(500);
		return redirect(302, `/m/${created.id}`);
	}
};
