import { describe, it, expect } from 'vitest';
import { escapeLike } from './where';

describe('escapeLike', () => {
	it('passes plain text through unchanged', () => {
		expect(escapeLike('klaas')).toBe('klaas');
	});

	it('escapes percent wildcards', () => {
		expect(escapeLike('%admin%')).toBe('\\%admin\\%');
	});

	it('escapes underscore wildcards', () => {
		expect(escapeLike('a_b')).toBe('a\\_b');
	});

	it('escapes backslashes so they pair with default Postgres ESCAPE \\', () => {
		expect(escapeLike('a\\b')).toBe('a\\\\b');
	});

	it('handles combined input', () => {
		expect(escapeLike('100%_off\\now')).toBe('100\\%\\_off\\\\now');
	});
});
