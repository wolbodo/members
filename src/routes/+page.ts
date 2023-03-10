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
	console.log('Query vars');
	const queryAllPeople = event.url.searchParams.has('all');
	// make sure we recognize the value
	// if (!['active', 'completed'].includes(event.url.searchParams)) {
	// 	throw error(400, 'invalid filter');
	// }

	return {
		where: queryAllPeople ? ALL_PEOPLE : ALL_MEMBERS
	};
};
