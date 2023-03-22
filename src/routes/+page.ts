import type { auth_person_bool_exp } from '$houdini';
import type { AllPeopleVariables } from './$houdini';

// This is the function for the AllPeople query.
// Query variable functions must be named _<QueryName>Variables.
/* @type { import('./$houdini').AllPeopleVariables } */

const ALL_MEMBERS: auth_person_bool_exp = {
	roles: {
		_or: [{ valid_till: { _gte: 'NOW()' } }, { valid_till: { _is_null: true } }],
		valid_from: { _lte: 'NOW()' },
		role: { _eq: 'member' }
	}
};

const ALL_PEOPLE: auth_person_bool_exp = {};

export const _AllPeopleVariables: AllPeopleVariables = (event) => {
	const queryAllPeople = event.url.searchParams.has('all');

	return {
		where: queryAllPeople ? ALL_PEOPLE : ALL_MEMBERS
	};
};
