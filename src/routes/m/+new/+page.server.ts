import { redirect, type Actions } from '@sveltejs/kit';
import { graphql, type auth_person_insert_input } from '$houdini';

const createPerson = graphql(`
	mutation CreatePerson($person: auth_person_insert_input!) {
		person: insert_auth_person_one(object: $person) {
			id
			name
		}
	}
`);

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const person: auth_person_insert_input = Object.fromEntries(
			Array.from(data.entries()).filter(([, value]) => Boolean(value))
		);

		const result = await createPerson.mutate({ person }, { event });

		if (result.data) {
			throw redirect(302, `/m/${result.data.person?.name}`);
		}
		return result;
	}
};
