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

import moment from 'moment'

import { parseToken } from 'src/lib/jwt'
import createStore from 'src/stores'

function authorize(req, res, next) {
  const cookie = (req.headers.cookie || '')
    .split(';')
    .map(s => s.split('='))
    .reduce((o, [name, value]) => ({
      ...o,
      [name.trim()]: decodeURI(value)
    }), {})

  // Check token expiry
  // console.log("Token:", cookie.token)
  if (cookie.token) {
    const parsed = parseToken(cookie.token)
    // console.log("Contents:", parsed)  
    const exp = moment.unix(parsed.exp)
    // console.log("exp:", moment(), exp, moment().isAfter(exp))
    // req.token ? next() : ((res.statusCode=401) && res.end('No token!'));
  }

  req.token = cookie.token

  next()
}
// Log every request
function logger(req, res, next) {
  console.log(`~> Received ${req.method} on ${req.url}`);
  next(); // move on
}

polka() // You can also use Express
	.use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    logger,
    authorize,
    bodyParser.json(),
		sapper.middleware({
      store: request => {
        return createStore({
          server: true, // ugly
          graphqlUri: process.env.GRAPHQL_LOCAL_URI,
          token: request.token,
          memberFilter: '',
        })
      }
    })
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
