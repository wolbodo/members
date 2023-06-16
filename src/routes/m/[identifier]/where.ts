import type { auth_person_bool_exp } from '$houdini';

export const where = (identifier: string): auth_person_bool_exp => {
	if (/^\d+$/.test(identifier)) {
		return { id: { _eq: parseInt(identifier) } };
	} else {
		return {
			name: { _ilike: identifier },
			roles: {
				_or: [{ valid_till: { _gte: 'NOW()' } }, { valid_till: { _is_null: true } }],
				valid_from: { _lte: 'NOW()' },
				role: { _eq: 'member' }
			}
		};
	}
};
