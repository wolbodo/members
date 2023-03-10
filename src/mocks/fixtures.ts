import type { AllRoles$result, PersonForEdit$result, AllPeople$result } from '$houdini';
import { faker } from '@faker-js/faker';

import { pick } from './util';

export const roles = ['member', 'board', 'admin'];

type Person = PersonForEdit$result['auth_person'][number] & AllPeople$result['people'][number];
type Role = 

let personid = 0;
const fakeRole = (role: string) => ({
	
})
const fakeRoles = (count?: number): string[] => faker.helpers.arrayElements(roles, count);
const fakePerson = (person?: Partial<Person>, roles?: string[]): Person => {
	const name = person?.name || faker.name.firstName();
	const lastname = person?.lastname || faker.name.lastName();
	return {
		id: personid++,
		name,
		firstname: name,
		lastname,
		email: faker.internet.email(name, lastname, 'example.com'),
		address: faker.address.streetAddress(),
		zipcode: faker.address.zipCode(),
		city: faker.address.city(),
		country: faker.address.country(),
		bankaccount: faker.finance.iban(),
		created: faker.date.past().toDateString(),
		modified: faker.date.recent().toDateString(),
		key_code: faker.random.alphaNumeric(5),
		note: faker.datatype.boolean() ? faker.lorem.sentence() : null,
		phone: faker.phone.number(),
		$fragments: {
			PersonRoles: true
		},
		roles: (roles ?? fakeRoles()).map((role) => ({ role })),
		...person
	};
};

export const allRoles: AllRoles$result = {
	roles: roles.map((role, id) => ({ role, id }))
};

export const people: Person[] = [
	fakePerson({ name: 'Piet', email: 'member@example.com' }, ['member']),
	fakePerson({ name: 'Klaas' }, ['member', 'board']),
	fakePerson({ name: 'Jan' }),
	...Array(faker.datatype.number({ max: 50 }))
		.fill(null)
		.map(() => fakePerson())
];
export const allPeople: AllPeople$result = {
	people: people.map(
		pick('name', 'email', 'phone', 'address', 'city', 'firstname', 'lastname', 'roles')
	) as AllPeople$result['people']
};
