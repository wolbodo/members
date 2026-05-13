import { eq, ilike } from 'drizzle-orm';
import { person } from '$lib/server/schema';

export const where = (identifier: string) => {
	if (/^\d+$/.test(identifier)) {
		return eq(person.id, parseInt(identifier));
	}
	return ilike(person.name, identifier);
};
