import preprocess from 'svelte-preprocess';
import houdini from 'houdini-preprocess';
import path from 'path';
import node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess(), houdini()],
	
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: node(),

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
