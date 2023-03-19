import { PersonByIdStore, EditPersonStore } from '$houdini';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';


const queryPerson = new PersonByIdStore();

export const actions: Actions = {
	edit: async (event) => {
		const { data: queryData } = await queryPerson.fetch({
			event,
			variables: {
				id: event.params.id,
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

		const editPerson = new EditPersonStore()

		return await editPerson.mutate({ id: parseInt(userId as string), data: dirtyData }, { event });
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
