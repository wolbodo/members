const dateFmt = new Intl.DateTimeFormat('nl', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric'
});
const timeFmt = new Intl.DateTimeFormat('nl', {
	hour: '2-digit',
	minute: '2-digit',
	hour12: false
});

// Date-only ISO strings are UTC midnight in JS but should be treated as local midnight
const parse = (dt: string): Date =>
	/^\d{4}-\d{2}-\d{2}$/.test(dt) ? new Date(`${dt}T00:00:00`) : new Date(dt);

export const datetime = (dt: string): string => {
	const d = parse(dt);
	return `${dateFmt.format(d)} ${timeFmt.format(d)}`;
};

export const formatDate = (dt: string): string => dateFmt.format(parse(dt));
