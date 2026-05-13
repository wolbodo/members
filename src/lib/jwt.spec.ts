import { vi, describe, it, expect } from 'vitest';
import { createToken, verifyToken } from './jwt';

vi.mock('$env/dynamic/private', () => ({
	env: { JWT_SECRET: 'test' }
}));

const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

describe('jwt', () => {
	const subject = 'test';
	const id = '0';

	it('creates and verifies a token', async () => {
		const token = createToken({ id }, { subject });
		const parsed = await verifyToken(token);

		expect(parsed.id).toBe(id);
		expect(parsed.sub).toBe(subject);
		expect(parsed.iss).toBe('auth');
		expect(parsed.exp - parsed.iat).toBe(24 * 60 * 60); // Default 1 day
	});

	it('verify fails for expired tokens', async () => {
		const token = createToken({ id }, { subject, expiresIn: '1s' });
		await wait(1100);
		await expect(verifyToken(token)).rejects.toThrow('jwt expired');
	});

	it('verify rejects unsigned (alg=none) tokens', async () => {
		// Manually construct a token with alg: none — must be rejected
		const header = Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url');
		const payload = Buffer.from(JSON.stringify({ id, sub: subject })).toString('base64url');
		const tampered = `${header}.${payload}.`;
		await expect(verifyToken(tampered)).rejects.toThrow();
	});
});
