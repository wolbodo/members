import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { person, personRole } from '$lib/server/schema';
import { eq, and, isNull, lte, or, isNotNull, asc } from 'drizzle-orm';

const MEMBERS_ONLY_CONDITION = and(
	or(isNull(personRole.valid_till), lte(personRole.valid_till, new Date())),
	lte(personRole.valid_from, new Date()),
	eq(personRole.role, 'member')
);

export const load: PageServerLoad = async ({ url, locals }) => {
	const showAll = url.searchParams.has('all');

	const people = await db
		.select({
			id: person.id,
			name: person.name,
			email: person.email,
			phone: person.phone,
			address: person.address,
			city: person.city,
			firstname: person.firstname,
			lastname: person.lastname
		})
		.from(person)
		.orderBy(asc(person.name));

	const roles = await db
		.select()
		.from(personRole)
		.where(and(isNull(personRole.valid_till), lte(personRole.valid_from, new Date())));

	const rolesByPerson = new Map<number, string[]>();
	for (const r of roles) {
		if (!r.person_id) continue;
		const list = rolesByPerson.get(r.person_id) ?? [];
		list.push(r.role);
		rolesByPerson.set(r.person_id, list);
	}

	const enriched = people.map((p) => ({
		...p,
		roles: (rolesByPerson.get(p.id) ?? []).map((role) => ({ role }))
	}));

	const filtered = showAll
		? enriched
		: enriched.filter((p) => p.roles.some((r) => r.role === 'member'));

	return { people: filtered, user: locals.user };
};
