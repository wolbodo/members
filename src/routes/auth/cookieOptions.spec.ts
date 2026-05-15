import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('cookieOptions', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('production: secure + domain + sameSite=none', async () => {
		vi.doMock('$app/environment', () => ({ dev: false }));
		vi.doMock('$env/dynamic/private', () => ({
			env: { COOKIE_DOMAIN: 'wolbodo.nl', COOKIE_SECURE: 'true' }
		}));
		const { options } = await import('./cookieOptions');
		expect(options.secure).toBe(true);
		expect(options.domain).toBe('wolbodo.nl');
		expect(options.sameSite).toBe('none');
		expect(options.path).toBe('/');
	});

	it('production: falls back to wolbodo.nl when COOKIE_DOMAIN is unset', async () => {
		vi.doMock('$app/environment', () => ({ dev: false }));
		vi.doMock('$env/dynamic/private', () => ({ env: { COOKIE_SECURE: 'true' } }));
		const { options } = await import('./cookieOptions');
		expect(options.domain).toBe('wolbodo.nl');
	});

	it('dev: omits domain and uses sameSite=lax', async () => {
		vi.doMock('$app/environment', () => ({ dev: true }));
		vi.doMock('$env/dynamic/private', () => ({ env: {} }));
		const { options } = await import('./cookieOptions');
		expect(options.domain).toBeUndefined();
		expect(options.sameSite).toBe('lax');
		expect(options.secure).toBe(false);
	});
});
