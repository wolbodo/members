import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

/**
 * Two Vitest projects:
 *  - `unit`      — plain node tests (format, jwt, safeEqual, …)
 *  - `storybook` — every story's `play` function, run in a real browser
 *                  via @storybook/addon-vitest. `pnpm test:unit` runs both.
 */
export default defineConfig(async () => ({
	test: {
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'unit',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					globals: true,
					environment: 'node'
				}
			},
			{
				extends: './vite.config.ts',
				plugins: [await storybookTest({ configDir: '.storybook' })],
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						headless: true,
						provider: playwright(),
						instances: [{ browser: 'chromium' }]
					}
				}
			}
		]
	}
}));
