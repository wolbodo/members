import { graphql, PersonForEditStore, query } from '$houdini';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

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
		const { data: queryData } = await queryPerson.fetch({
			event,
			variables: {
				name: event.params.name,
				isBoard: event.locals.user.roles.includes('board')
			}
		});

		if (!queryData) {
			throw fail(500);
		}

		const {
			auth_person: [person]
		} = queryData;
		console.log(person)
		const formData = await event.request.formData();
		console.log(Array.from(formData.entries()), Array.from(formData.entries()).filter(([key, value]) => {
			if (key === 'password' && value === '') return false;
			if (key === 'id') return true;

			if (person[key as keyof typeof person] !== value) return true;
		}))
		const { id: userId, ...dirtyData } = Object.fromEntries(
			Array.from(formData.entries()).filter(([key, value]) => {
				if (key === 'password' && value === '') return false;
				if (key === 'id') return true;

				if (person[key as keyof typeof person] !== value) return true;
			})
		);
		console.log(userId, dirtyData)

		return await mutation.mutate({ id: parseInt(userId as string), data: dirtyData }, { event });
	}
};

export const load: PageServerLoad = async (event) => {
	return {
		variables: {
			name: event.params.name,
			isBoard: event.locals.user.roles.includes('board'),
			isSelf: event.params.name === event.locals.user.name
		}
	};
};
