export const ROLE_NAMES = [
	'member',
	'board',
	'nerd',
	'muzikant',
	'im',
	'klusser',
	'wolpop',
	'schoonmaker',
	'server'
] as const;

export type RoleName = (typeof ROLE_NAMES)[number];

/** Resolve a role name to its CSS custom property reference. */
export function roleVar(role: string): string {
	return `var(--role-${role})`;
}

/** Inline style snippet for the three-tone (text / border / bg) role color treatment. */
export function roleColorStyle(role: string): string {
	const c = roleVar(role);
	return `color: ${c}; border-color: color-mix(in srgb, ${c} 50%, transparent); background: color-mix(in srgb, ${c} 8%, transparent);`;
}

/** Lighter mix used in tag (profile) density. */
export function roleTagColorStyle(role: string): string {
	const c = roleVar(role);
	return `color: ${c}; border-color: color-mix(in srgb, ${c} 45%, transparent); background: color-mix(in srgb, ${c} 7%, transparent);`;
}
