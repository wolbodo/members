import type { auth_person_bool_exp } from '$houdini';
import type { PersonVariables } from './$houdini';
import { where } from './where';

export const _PersonVariables: PersonVariables = (event) => {
	return {
		...event.data!.variables,
		where: where(event.params.identifier)
	};
};
