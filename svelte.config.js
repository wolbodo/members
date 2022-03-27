import preprocess from 'svelte-preprocess';
import houdini from 'houdini-preprocess';
import path from 'path';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess(), houdini()],
	
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: adapter(),

        vite: {
			server: {
				fs: {
					allow: ['.']
				}
			},
            resolve: {
                alias: {
                    $houdini: path.resolve('.', '$houdini')
                }
            }
        }
	}
};

export default config;
