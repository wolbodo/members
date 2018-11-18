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

import { createProvider } from 'svelte-apollo';

import * as jwt from '../lib/jwt'

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

function createServerLink(url, token) {
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
function createBrowserLink(url, token) {
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
        if (networkError) console.log(`[Network error]:`, networkError);
      }),
      ApolloLink.split(
        operation => {
          const operationAST = getOperationAST(operation.query, operation.operationName)
          const isSubscription = !!operationAST && operationAST.operation === 'subscription'
          return isSubscription
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

function createClient(link) {
  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  });

}

export default BaseStore =>
  class Store extends BaseStore {
    constructor (init) {
      super({
        ...init
      })

      this.on('state', ({changed, current}) => {
        console.log("Running this")
        if ('authToken' in changed) {
          console.log("Got local token: store it:", current.authToken)
          if (current.authToken) {
            localStorage.setItem('token', current.authToken)
          } else {
            localStorage.removeItem('token')
          }
        } else if (!current.authToken) {
          // Try reading from localstorage
          if (global.localStorage) {
            const local = localStorage.getItem('token')
            if (local) {
              console.log("Setting local token:", local)
              this.set({
                authToken: local
              })
            }
          }
        }
      })

      this.compute(
        'graphql',
        ['authToken', 'graphqlUri'],
        (authToken, graphqlUri) => {
          console.log("Creating provider:", (authToken && graphqlUri))
          if (authToken && graphqlUri) {
            return createProvider(
              createClient(
                createBrowserLink(graphqlUri, authToken)
              )
            )
          }
        }
      )

      this.compute(
        'authTokenParsed',
        ['authToken'],
        authToken => authToken && jwt.parse(authToken)
      )

      this.compute(
        'loggedIn',
        ['authToken'],
        authToken => !!authToken
      )
    }

    getServerClient(url, token) {
      return createClient(createServerLink(url, token))
    }
  }