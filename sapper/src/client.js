import * as sapper from '../__sapper__/client.js';

import createStore from './stores'

sapper.start({
  target: document.querySelector('#sapper'),
  store: data => createStore({
    ...data,
    server: false, // ugly    
    graphqlUri: process.env.GRAPHQL_URI
  })
});