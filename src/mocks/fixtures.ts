import type { AllRoles$result, PersonForEdit$result, AllPeople$result, PersonRoles$data } from '$houdini';
import { faker } from '@faker-js/faker';

import { pick, omit } from './util';

export const roles = ['member', 'board', 'admin'];

faker.seed(42)

type Person = Omit<PersonForEdit$result['auth_person'][number] & AllPeople$result['people'][number], '$fragments'>;
type Role = PersonRoles$data['roles'][number]

let personid = 0;
let roleid = 0;

const maybe = <T>(value: T): T|null => faker.datatype.boolean() ? value : null

export const fakeRole = (role: string): Role => ({
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
		email: maybe(faker.internet.email(name, lastname, 'example.com')),
		address: maybe(faker.address.streetAddress()),
		zipcode: maybe(faker.address.zipCode()),
		city: maybe(faker.address.city()),
		country: maybe(faker.address.country()),
		bankaccount: maybe(faker.finance.iban()),
		created: maybe(faker.date.past().toISOString()),
		modified: maybe(faker.date.recent().toISOString()),
		key_code: maybe(faker.random.alphaNumeric(5)),
		note: maybe(faker.lorem.sentence()),
		phone: maybe(faker.phone.number()),
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
