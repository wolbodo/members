import type { RequestEvent } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { db } from './db';

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

type AuditOverride = { id?: string; role?: string };

const ROLE_PRIORITY = ['board', 'admin', 'member', 'self'] as const;

const pickRole = (roles: string[] | undefined): string => {
	if (!roles?.length) return '';
	return ROLE_PRIORITY.find((r) => roles.includes(r)) ?? roles[0];
};

export const withAuditContext = async <T>(
	event: RequestEvent,
	fn: (tx: Tx) => Promise<T>,
	override: AuditOverride = {}
): Promise<T> => {
	const userId = override.id ?? event.locals.user?.id ?? '';
	const role = override.role ?? pickRole(event.locals.user?.roles);

	return db.transaction(async (tx) => {
		await tx.execute(sql`SELECT set_config('app.user_id', ${userId}, true)`);
		await tx.execute(sql`SELECT set_config('app.user_role', ${role}, true)`);
		return fn(tx);
	});
};
