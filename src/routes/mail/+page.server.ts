import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const entries = await db.query.mailEntries.findMany({
		with: {
			person: {
				columns: { name: true, email: true }
			}
		},
		orderBy: (m, { desc }) => [desc(m.created)],
		limit: 100
	});

	const mails = entries.map((m) => ({
		id: m.id,
		status: m.status,
		template: m.template,
		created: m.created,
		personName: m.person.name,
		personEmail: m.person.email
	}));

	return { mails };
};
