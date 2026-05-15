import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		csp: {
			mode: 'nonce',
			directives: {
				'default-src': ['self'],
				'img-src': ['self', 'data:'],
				'style-src': ['self', 'unsafe-inline'],
				'font-src': ['self', 'data:'],
				'script-src': ['self'],
				'base-uri': ['self'],
				'frame-ancestors': ['none']
			}
		}
	}
};

export default config;
