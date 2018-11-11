import * as sapper from '../__sapper__/client.js';

import { Store } from 'svelte/store.js';

import createClient from './lib/graphql'


sapper.start({
  target: document.querySelector('#sapper'),
  store: data => {
    // `data` is whatever was in the server-side store
    return new Store({
      ...data,
      graphqlClient: createClient('http://members-graphql-1.dev.dock/v1alpha1/graphql')
    });
  }
});