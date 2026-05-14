import { fail } from '@sveltejs/kit';
import { eq, and, isNull } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { person, personRole } from '$lib/server/schema';
import { withAuditContext } from '$lib/server/audit';
import type { Actions, PageServerLoad } from './$types';
import { where } from './where';

export const load: PageServerLoad = async (event) => {
	const isBoard = event.locals.user!.roles.includes('board');
	const isSelf = event.params.identifier.toLowerCase() === event.locals.user!.name.toLowerCase();

	const found = await db.query.person.findFirst({
		where: where(event.params.identifier),
		with: {
			roles: true
		}
	});

	if (!found) return { person: null, roles: [], isBoard, isSelf };

	const { roles, ...personData } = found;

	const redacted = {
		...personData,
		bankaccount: isBoard || isSelf ? personData.bankaccount : null,
		key_code: isBoard ? personData.key_code : null,
		note: isBoard ? personData.note : null
	};

	return { person: redacted, roles, isBoard, isSelf };
};

export const actions: Actions = {
	edit: async (event) => {
		const isBoard = event.locals.user!.roles.includes('board');
		const isSelf = event.params.identifier.toLowerCase() === event.locals.user!.name.toLowerCase();

		if (!isBoard && !isSelf) return fail(403);

		const [existing] = await db
			.select()
			.from(person)
			.where(where(event.params.identifier))
			.limit(1);

		if (!existing) return fail(404);

		const formData = await event.request.formData();
		const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
		const { id: _id, ...fields } = raw;

		const updates: Partial<typeof person.$inferInsert> = {};

		for (const [key, value] of Object.entries(fields)) {
			const col = key as keyof typeof existing;
			if (key === 'password' && !value) continue;
			if (typeof existing[col] === 'boolean') {
				(updates as Record<string, unknown>)[key] = key in fields && value === 'on';
			} else if (value !== String(existing[col])) {
				(updates as Record<string, unknown>)[key] =
					typeof value === 'string' ? value.trim() : value;
			}
		}

		if (!Object.keys(updates).length) return { success: true };

		await withAuditContext(event, (tx) =>
			tx.update(person).set(updates).where(eq(person.id, existing.id))
		);
		return { success: true };
	},

	addRole: async (event) => {
		const isBoard = event.locals.user!.roles.includes('board');
		if (!isBoard) return fail(403);

		const formData = await event.request.formData();
		const personId = parseInt(formData.get('personId') as string);
		const role = formData.get('role') as string;

		if (!personId || !role) return fail(400);

		const existing = await db
			.select()
			.from(personRole)
			.where(
				and(
					eq(personRole.person_id, personId),
					eq(personRole.role, role),
					isNull(personRole.valid_till)
				)
			);

		if (existing.length) return { success: true };

		await withAuditContext(event, (tx) =>
			tx.insert(personRole).values({ person_id: personId, role })
		);
		return { success: true };
	},

	stopRole: async (event) => {
		const isBoard = event.locals.user!.roles.includes('board');
		if (!isBoard) return fail(403);

		const formData = await event.request.formData();
		const roleId = parseInt(formData.get('roleId') as string);

		if (!roleId) return fail(400);

		await withAuditContext(event, (tx) =>
			tx.update(personRole).set({ valid_till: new Date() }).where(eq(personRole.id, roleId))
		);
		return { success: true };
	}
};
