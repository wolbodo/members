/** Full mock of `App.Locals['user']` (a decoded JWT payload) for page stories. */
export function mockUser(
	overrides: Partial<NonNullable<App.Locals['user']>> = {}
): NonNullable<App.Locals['user']> {
	const name = overrides.name ?? 'Klaas';
	return {
		id: '1',
		name,
		email: `${name.toLowerCase()}@wolbodo.nl`,
		roles: ['board', 'self'],
		iat: 1_700_000_000,
		exp: 1_900_000_000,
		iss: 'wolbodo-members',
		sub: '1',
		token: 'mock.jwt.token',
		...overrides
	};
}
