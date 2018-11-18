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
import http from 'http'

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

import createStore from './stores'

function authorize(req, res, next) {
  const cookie = (req.headers.cookie || '')
    .split(';')
    .map(s => s.split('='))
    .reduce((o, [name, value]) => ({
      ...o,
      [name.trim()]: decodeURI(value)
    }), {})

  req.token = cookie.token

  console.log("Got cookie:", cookie)
  // mutate req; available later
  // req.token = req.headers['authorization'];
  // req.token ? next() : ((res.statusCode=401) && res.end('No token!'));

  next()
}

polka() // You can also use Express
	.use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    bodyParser.json(),
    authorize,
		sapper.middleware({
      store: request => {
        return createStore({
          graphqlUri: process.env.GRAPHQL_ENDPOINT,
          authToken: request.token,
          memberFilter: '',
        })
      }
    })
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
