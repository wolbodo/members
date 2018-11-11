import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import fetch from 'node-fetch';

import createJWT from './jwt'

// https://www.apollographql.com/docs/react/advanced/boost-migration.html

const authLink = setContext((_, { headers }) => {
  const token = createJWT({
    id: -1,
    name: 'login',
    user_roles: [
      { role: { name: 'admin'}}
    ]
  });
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export default function createClient(uri) {
  const client = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      authLink.concat(
        new HttpLink({
          uri: uri,
          credentials: 'same-origin',
          fetch
        })
      )
    ]),
    cache: new InMemoryCache()
  });

  return client
}