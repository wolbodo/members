import { describe, it, expect } from 'vitest';
import { safeEqual } from './safeEqual';

describe('safeEqual', () => {
	it('matches identical strings', () => {
		expect(safeEqual('secret', 'secret')).toBe(true);
	});

	it('rejects different strings of equal length', () => {
		expect(safeEqual('secret', 'secrex')).toBe(false);
	});

	it('rejects strings of different length without throwing', () => {
		expect(safeEqual('a', 'ab')).toBe(false);
		expect(safeEqual('', 'x')).toBe(false);
	});

	it('handles empty strings', () => {
		expect(safeEqual('', '')).toBe(true);
	});

	it('is unicode-safe', () => {
		expect(safeEqual('café', 'café')).toBe(true);
		expect(safeEqual('café', 'cafe')).toBe(false);
	});
});
