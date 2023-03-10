import { graphql, context, type RequestHandler } from 'msw';

import { pick, ilike, omit } from './util';
import * as fixtures from './fixtures';

const backend = graphql.link('http://graphql.wolbodo/v1/graphql');
import bcrypt, { hash } from 'bcryptjs';
import type { GetPassword$result, PersonForEdit$result } from '$houdini';

export const cors = (host = '*') => context.set('Access-Control-Allow-Origin', '*');

export const handlers: RequestHandler[] = [
	backend.query('AllRoles', (req, res, ctx) => res(cors(), ctx.data(fixtures.allRoles))),
	// backend.query('PersonRoles', (req, res, ctx) => {
	// 	throw new Error('not implemented PersonRoles');
	// }),
	backend.query('AllPeople', async (req, res, ctx) => res(cors(), ctx.data(fixtures.allPeople))),
	backend.query('GetPassword', (req, res, ctx) => {
		const nameOrEmail = req.variables.name.toLowerCase();

		const person = fixtures.people.find(
			({ name, email }) => ilike(nameOrEmail, name) || (email && ilike(nameOrEmail, email))
		);

		if (!person) {
			return res(cors(), ctx.errors([]));
		}

		const result: GetPassword$result = {
			auth_person: [
				{
					...person,
					password: bcrypt.hashSync('test')
				}
			]
		};
		return res(cors(), ctx.data(result));
	}),
	// backend.query('PersonByEmail', (req, res, ctx) => {
	// 	throw new Error('not implemented PersonByEmail');
	// }),
	// backend.query('History', (req, res, ctx) => {
	// 	throw new Error('not implemented History');
	// }),
	backend.query('PersonForEdit', (req, res, ctx) => {
		const { name, isBoard, isSelf } = req.variables;
		const person = fixtures.people.find((person) => ilike(person.name, name));

		if (!person) {
			return res(cors(), ctx.data({}));
		}

		const omitFields = omit(
			...(isBoard ? [] : isSelf ? ['key_code'] : ['key_code', 'bankaccount'])
		);
		const data: PersonForEdit$result = {
			auth_person: [omitFields(person) as PersonForEdit$result['auth_person'][0]]
		};
		return res(cors(), ctx.data(data));
	})
	// backend.query('AllMail', (req, res, ctx) => {
	// 	throw new Error('not implemented AllMail');
	// })
	// backend.mutation('StopRole', (req, res, ctx) => {
	// 	throw new Error('not implemented StopRole');
	// }),

	// backend.mutation('CreateRole', (req, res, ctx) => {
	// 	throw new Error('not implemented CreateRole');
	// }),

	// backend.mutation('SendMail', (req, res, ctx) => {
	// 	throw new Error('not implemented SendMail');
	// }),

	// backend.mutation('EditPerson', (req, res, ctx) => {
	// 	throw new Error('not implemented EditPerson');
	// }),

	// backend.mutation('CreatePerson', (req, res, ctx) => {
	// 	throw new Error('not implemented CreatePerson');
	// }),
];
