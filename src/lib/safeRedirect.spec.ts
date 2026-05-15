import { describe, it, expect } from 'vitest';
import { safeRedirect } from './safeRedirect';

describe('safeRedirect', () => {
	it('falls back when input is null or empty', () => {
		expect(safeRedirect(null)).toBe('/');
		expect(safeRedirect('')).toBe('/');
		expect(safeRedirect(undefined)).toBe('/');
	});

	it('accepts same-origin relative paths', () => {
		expect(safeRedirect('/m/klaas')).toBe('/m/klaas');
		expect(safeRedirect('/')).toBe('/');
	});

	it('rejects protocol-relative urls (//evil.com)', () => {
		expect(safeRedirect('//evil.com')).toBe('/');
	});

	it('accepts exact wolbodo.nl', () => {
		expect(safeRedirect('https://wolbodo.nl/x')).toBe('https://wolbodo.nl/x');
	});

	it('accepts wolbodo.nl subdomains', () => {
		expect(safeRedirect('https://leden.wolbodo.nl/')).toBe('https://leden.wolbodo.nl/');
	});

	it('rejects suffix-attack domains', () => {
		expect(safeRedirect('https://evilwolbodo.nl/')).toBe('/');
		expect(safeRedirect('https://wolbodo.nl.attacker.com/')).toBe('/');
	});

	it('rejects non-http(s) protocols', () => {
		expect(safeRedirect('javascript:alert(1)')).toBe('/');
		expect(safeRedirect('data:text/html,<script>1</script>')).toBe('/');
		expect(safeRedirect('file:///etc/passwd')).toBe('/');
	});

	it('rejects garbage', () => {
		expect(safeRedirect('not a url')).toBe('/');
	});

	it('honours a custom fallback', () => {
		expect(safeRedirect(null, '/home')).toBe('/home');
	});
});
