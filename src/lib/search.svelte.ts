/**
 * Shared search state, used by the AppHeader search slot and the route
 * pages that filter on it (Changes, Mail).
 */
export const searchState = $state({ value: '' });

export function filterFields<T>(
	items: T[],
	q: string,
	fields: (keyof T | ((item: T) => string | null | undefined))[]
): T[] {
	const needle = q.trim().toLowerCase();
	if (!needle) return items;
	return items.filter((it) =>
		fields.some((f) => {
			const v = typeof f === 'function' ? f(it) : (it[f] as unknown);
			return typeof v === 'string' && v.toLowerCase().includes(needle);
		})
	);
}
