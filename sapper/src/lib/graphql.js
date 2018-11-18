import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { WebSocketLink } from 'apollo-link-ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { ApolloLink } from 'apollo-link';
import { getOperationAST } from 'graphql/utilities' // ES6
import fetch from 'cross-fetch';

// https://www.apollographql.com/docs/react/advanced/boost-migration.html

function createAuthLink(token) {
  return setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });
}

export function createServerLink(url, token) {
  // Split protocol
  const [, proto, uri] = url.match(/(\w+):\/\/(.*)/ )

  return ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      createAuthLink(token).concat(new HttpLink({
        uri: `http://${uri}`,
        fetch
      }))
    ])
}
export function createBrowserLink(url, token) {
  // Split protocol
  const [, proto, uri] = url.match(/(\w+):\/\/(.*)/ )

  return ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      ApolloLink.split(
        operation => {
          const operationAST = getOperationAST(operation.query, operation.operationName)
          return !!operationAST && operationAST.operation === 'subscription'
        },
        new WebSocketLink({
          uri: `ws://${uri}`,
          options: {
            reconnect: true,
            connectionParams: {
              headers: {
                authorization: token ? `Bearer ${token}` : "",
              }
            },
          }
        }),
        createAuthLink(token).concat(new HttpLink({
          uri: `http://${uri}`,
          fetch
        }))
      )
    ])
}

export default function createClient(link) {
  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  });

}