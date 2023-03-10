import type { AllRoles$result, PersonForEdit$result, AllPeople$result, PersonRoles$data } from '$houdini';
import { faker } from '@faker-js/faker';

import { pick, omit } from './util';

export const roles = ['member', 'board', 'admin'];

faker.seed(42)

type Person = Omit<PersonForEdit$result['auth_person'][number] & AllPeople$result['people'][number], '$fragments'>;
type Role = PersonRoles$data['roles'][number]

let personid = 0;
let roleid = 0;

const fakeRole = (role: string): Role => ({
	id: roleid++,
	role,
	valid_from: faker.date.past().toISOString(),
	valid_till: null
})
const fakeRoles = (count?: number): Role[] => faker.helpers.arrayElements(roles, count).map(fakeRole);
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
		created: faker.date.past().toISOString(),
		modified: faker.date.recent().toISOString(),
		key_code: faker.random.alphaNumeric(5),
		note: faker.datatype.boolean() ? faker.lorem.sentence() : null,
		phone: faker.phone.number(),
		roles: (roles ? roles.map(fakeRole) : fakeRoles()),
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
	people: people.map((person) => ({
		...person,
		roles: person.roles.map(pick('role'))
	})).map(
		pick('name', 'email', 'phone', 'address', 'city', 'firstname', 'lastname', 'roles')
	) as AllPeople$result['people']
};
