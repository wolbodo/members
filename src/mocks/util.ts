export const pick =
	(...fields: string[]) =>
	(obj: Record<string, unknown>) =>
		Object.fromEntries(Object.entries(obj).filter(([key]) => fields.includes(key)));
export const omit =
	(...fields: string[]) =>
	(obj: Record<string, unknown>) =>
		Object.fromEntries(Object.entries(obj).filter(([key]) => !fields.includes(key)));
export const ilike = (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase();
