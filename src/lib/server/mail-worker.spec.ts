import { describe, it, expect, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({
	env: { EMAIL_HOST: 'localhost', EMAIL_PORT: '1025' }
}));
vi.mock('$env/dynamic/public', () => ({
	env: { PUBLIC_URL: 'https://members.wolbodo.nl' }
}));
// Don't actually open a postgres connection during this spec.
vi.mock('$lib/server/db', () => ({ db: {}, client: { listen: vi.fn() } }));

const { buildMessage, stripHtml } = await import('./mail-worker');

describe('stripHtml', () => {
	it('collapses tags and whitespace', () => {
		expect(stripHtml('<p>hello   <b>world</b></p>')).toBe('hello world');
	});
});

describe('buildMessage', () => {
	it('renders password-reset with subject from <title>', () => {
		const msg = buildMessage('password-reset', {
			person: { name: 'Klaas' },
			data: { token: 'tkn' }
		});
		expect(msg.subject).toBe('Reset your password');
		expect(msg.html).toContain('Klaas');
		expect(msg.text).toContain('Klaas');
		expect(msg.html).toContain('tkn');
	});

	it('renders password-change-notification', () => {
		const msg = buildMessage('password-change-notification', {
			person: { name: 'Mieke' },
			data: {}
		});
		expect(msg.subject).toBe('Your password has changed');
		expect(msg.text).toContain('Mieke');
	});

	it('throws on unknown template key', () => {
		expect(() => buildMessage('nope', { person: { name: '' }, data: {} })).toThrowError(
			/unknown template/
		);
	});
});
