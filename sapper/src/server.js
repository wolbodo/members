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

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

import createStore from './stores'

polka() // You can also use Express
	.use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    bodyParser.json(),
		sapper.middleware({
      store: request => createStore({
        graphqlUri: process.env.GRAPHQL_ENDPOINT,
      })
    })
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
