import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import houdini from 'houdini/vite';

const config: UserConfig = {
	server: {
		host: '0.0.0.0'
	},
	plugins: [houdini(), sveltekit()]
};

export default config;
