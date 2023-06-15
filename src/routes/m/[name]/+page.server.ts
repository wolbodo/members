import {
	PersonByNameStore,
	EditPersonStore,
	type auth_person_set_input,
	type PersonByName$result
} from '$houdini';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
const queryPerson = new PersonByNameStore();

type FilterProperties<T, TFieldType> = {
	[K in keyof T as T[K] extends TFieldType ? K : never]: T[K];
};

type BooleanKey = keyof FilterProperties<auth_person_set_input, boolean | null | undefined>;

export const actions: Actions = {
	edit: async (event) => {
		const isBoard = event.locals.user.roles.includes('board');
		const isSelf =
			event.params.name.toLocaleLowerCase() === event.locals.user.name.toLocaleLowerCase();
		const { data: queryData } = await queryPerson.fetch({
			event,
			variables: {
				name: event.params.name,
				isBoard
			}
		});

		if (!queryData) {
			throw fail(500);
		}

		const {
			auth_person: [person]
		} = queryData;

		const formData = await event.request.formData();

		const { id: userId, ...dirtyData } = Object.fromEntries(
			Array.from(formData.entries()).filter(([key, value]) => {
				if (key === 'password' && value === '') return false;
				if (key === 'id') return true;

				if (person[key as keyof typeof person] !== value) return true;
			})
		) as auth_person_set_input;

		// Fix all boolean keys

		for (let [key, value] of Object.entries(person)) {
			if (typeof value === 'boolean') {
				const booleanKey = key as BooleanKey;
				dirtyData[booleanKey] = booleanKey in dirtyData;
			}
		}

		console.log('Updating', dirtyData);

		const editPerson = new EditPersonStore();
		return await editPerson.mutate(
			{
				id: parseInt(userId as string),
				data: dirtyData
			},
			{
				event,
				metadata: { isBoard, isSelf }
			}
		);
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
