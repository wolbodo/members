import { redirect, fail } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { person } from '$lib/server/schema';
import { withAuditContext } from '$lib/server/audit';
import { PersonSchema } from '$lib/schemas/person';
import { warn } from '$lib/server/log';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(PersonSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(PersonSchema));
		if (!form.valid) return fail(400, { form });

		try {
			const created = await withAuditContext(event, async (tx) => {
				const [row] = await tx
					.insert(person)
					.values({ ...form.data })
					.returning({ id: person.id });
				return row;
			});
			if (!created) return fail(500, { form });
			return redirect(303, `/m/${created.id}`);
		} catch (err) {
			const pgErr = err as { code?: string; constraint_name?: string };
			if (pgErr.code === '23505') {
				return setError(form, 'email', 'already in use');
			}
			warn('m/+new: unexpected db error', { err });
			throw err;
		}
	}
};
