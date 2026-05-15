import { eq, ilike } from 'drizzle-orm';
import { person } from '$lib/server/schema';

export const escapeLike = (s: string): string => s.replace(/[\\%_]/g, '\\$&');

export const where = (identifier: string) => {
	if (/^\d+$/.test(identifier)) {
		return eq(person.id, parseInt(identifier));
	}
	return ilike(person.name, escapeLike(identifier));
};
