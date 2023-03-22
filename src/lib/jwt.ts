import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';

type ParsedToken = {
	email: string;
	name: string;
	id: string;
	roles: string[];
	iat: number;
	exp: number;
	iss: string;
	sub: string;
};

type SignPayload = { id: string, name?: string, roles?: string[] }
type SignOptions = Parameters<typeof jwt.sign>[2]

export function createToken(
	token: SignPayload,
	{ subject, expiresIn = '1 day', issuer = 'auth', ...options }: SignOptions
): string {
	return jwt.sign(token, env.AUTH_JWT_SECRET_KEY, {
		subject,
		expiresIn,
		issuer,
		...options
	});
}

export function parseToken(token: string): ParsedToken {
	return jwt.decode(token) as ParsedToken;
}

export async function verifyToken(token: string): Promise<ParsedToken> {
	return await jwt.verify(token, env.AUTH_JWT_SECRET_KEY) as ParsedToken;
}

export function serverToken(username: string, id = -1, role = 'server'): string {
	return createToken(
		{
			id: id.toString(),
			name: username,
			roles: [role]
		},
		{
			subject: '-1'
		}
	);
}
