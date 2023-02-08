import { graphql, PersonForEditStore } from '$houdini';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

const mutation = graphql(`
	mutation EditPerson($id: Int!, $data: auth_person_set_input!) {
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
const queryPerson = new PersonForEditStore();

export const actions: Actions = {
	edit: async (event) => {
		const { id: userId, ...data } = Object.fromEntries((await event.request.formData()).entries());
		console.log(data);

		const person = await queryPerson.fetch({
			event,
			variables: {
				name: event.params.name,
				isBoard: event.locals.user.roles.includes('board')
			}
		});
		console.log(person);

		const respo = await mutation.mutate({ id: parseInt(userId as string), data }, { event });
		console.log('REspons', respo);
		return respo;
	}
};
