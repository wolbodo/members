import type { auth_person_bool_exp } from '$houdini';
import type { PersonVariables } from './$houdini';

export const _PersonVariables: PersonVariables = (event) => {
	let where: auth_person_bool_exp = {};
	if (/^\d+$/.test(event.params.identifier)) {
		where = { id: { _eq: parseInt(event.params.identifier) } };
	} else {
		where = {
			name: { _ilike: event.params.identifier },
			roles: {
				_or: [{ valid_till: { _gte: 'NOW()' } }, { valid_till: { _is_null: true } }],
				valid_from: { _lte: 'NOW()' },
				role: { _eq: 'member' }
			}
		};
	}

	return {
		...event.data!.variables,
		where
	};
};
