import dotenv from 'dotenv';
dotenv.config({
  path: path.resolve('../', '.env')
})

import sirv from 'sirv';
import polka from 'polka';
import path from 'path';
import compression from 'compression';
import bodyParser from 'body-parser'
import * as sapper from '../__sapper__/server.js';
import { Store } from 'svelte/store.js';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';


polka() // You can also use Express
	.use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    bodyParser.json(),
		sapper.middleware({
      store: request => {
        return new Store({
        });
      }
    })
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
