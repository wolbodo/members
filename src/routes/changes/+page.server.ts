import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { history, person } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const rows = await db
		.select({
			id: history.id,
			timestamp: history.timestamp,
			new_values: history.new_values,
			old_values: history.old_values,
			role: history.role,
			author_id: history.author_id,
			person_id: history.person_id
		})
		.from(history)
		.orderBy(desc(history.timestamp))
		.limit(500);

	const personIds = [
		...new Set([
			...rows.map((r) => r.author_id).filter(Boolean),
			...rows.map((r) => r.person_id).filter(Boolean)
		])
	] as number[];

	const names = personIds.length
		? await db
				.select({ id: person.id, name: person.name })
				.from(person)
				.where(
					personIds.length === 1
						? eq(person.id, personIds[0])
						: (builder) => builder.in('id', personIds)
				)
		: [];

	const nameMap = new Map(names.map((p) => [p.id, p.name]));

	const historyWithNames = rows.map((r) => ({
		...r,
		author: r.author_id ? { name: nameMap.get(r.author_id) ?? '' } : null,
		person: r.person_id ? { name: nameMap.get(r.person_id) ?? '' } : null
	}));

	return { history: historyWithNames };
};
