import * as sapper from '../__sapper__/client.js';

import { Store } from 'svelte/store.js';

import { createProvider } from 'svelte-apollo';
import createClient, { createBrowserLink } from './lib/graphql'


sapper.start({
  target: document.querySelector('#sapper'),
  store: data => {
    // `data` is whatever was in the server-side store
    const store = new Store(data);

    store.compute(
      'graphql',
      ['graphqlUrl', 'authToken'],
      (url, token) => {
        if (url && token) {
          return createProvider(createClient(createBrowserLink(url, token)))
        }
      }
    );

    return store
  }
});