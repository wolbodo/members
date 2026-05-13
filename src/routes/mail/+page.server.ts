import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { mailEntries, person } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const mails = await db
		.select({
			id: mailEntries.id,
			status: mailEntries.status,
			template: mailEntries.template,
			created: mailEntries.created,
			personName: person.name,
			personEmail: person.email
		})
		.from(mailEntries)
		.innerJoin(person, eq(mailEntries.person_id, person.id))
		.orderBy(desc(mailEntries.created))
		.limit(100);

	return { mails };
};
