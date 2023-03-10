import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (({ locals }) => {
	if (!locals?.user) {
		throw redirect(302, '/auth/login');
	}
	throw redirect(302, '/');
}) satisfies PageLoad;
