import { db } from '$lib/server/db';
import { mailEntries } from '$lib/server/schema';
import type { RequestEvent } from '@sveltejs/kit';

export { default as templates } from './templates';

export const send = async (
	_event: RequestEvent,
	personId: number,
	template: string,
	data: Record<string, unknown>
) => {
	await db.insert(mailEntries).values({ person_id: personId, template, data });
};
