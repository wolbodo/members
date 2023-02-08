import { graphql, type auth_person_set_input } from '$houdini';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	edit: async (event) => {
		const { user } = event.locals;

		const data = Object.fromEntries(
			(await event.request.formData()).entries()
		) as auth_person_set_input;
		console.log(user);

		const mutation = graphql(`
			mutation EditPerson2($id: Int!, $data: auth_person_set_input!) {
				person: update_auth_person(where: { id: { _eq: $id } }, _set: $data) {
					returning {
						name
						firstname
						lastname
						email
						phone
						address
						zipcode
						city
						country
						note
						id
						created
						modified

						bankaccount
						key_code
					}
				}
			}
		`);
		const respo = await mutation.mutate({ id: parseInt(user.id), data }, { event });
		console.log('REspons', respo);
		return respo;
	}
};
