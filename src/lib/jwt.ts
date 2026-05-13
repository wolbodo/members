import { env } from '$env/dynamic/private';
import jwt, { type SignOptions } from 'jsonwebtoken';

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

type SignPayload = { id: string; name?: string; roles?: string[] };
type TokenOptions = Omit<SignOptions, 'subject'> & { subject: string };

export function createToken(
	token: SignPayload,
	{ subject, expiresIn = '1 day', issuer = 'auth', ...options }: TokenOptions
): string {
	return jwt.sign(token, env.JWT_SECRET!, { subject, expiresIn, issuer, ...options });
}

export function parseToken(token: string): ParsedToken {
	return jwt.decode(token) as ParsedToken;
}

export async function verifyToken(token: string): Promise<ParsedToken> {
	return jwt.verify(token, env.JWT_SECRET!) as unknown as ParsedToken;
}

export function serverToken(username: string, id = -1, role = 'server'): string {
	return createToken(
		{ id: id.toString(), name: username, roles: [role] },
		{ subject: '-1' }
	);
}
