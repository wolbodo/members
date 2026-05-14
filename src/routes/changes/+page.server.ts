import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const history = await db.query.history.findMany({
		with: {
			author: {
				columns: { name: true }
			},
			person: {
				columns: { name: true }
			}
		},
		orderBy: (h, { desc }) => [desc(h.timestamp)],
		limit: 500
	});

	return { history };
};
