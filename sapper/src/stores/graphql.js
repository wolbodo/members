import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { WebSocketLink } from 'apollo-link-ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import fetchPonyfill from 'fetch-ponyfill';
import { createProvider, connect } from 'svelte-apollo';

import * as jwt from 'src/lib/jwt'

const { fetch } = fetchPonyfill();

// https://www.apollographql.com/docs/react/advanced/boost-migration.html

function createAuthLink(token, role = 'anonymous') {
  return setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        'X-Hasura-Role': role
      }
    }
  });
}

function createServerLink(url, token, role) {
  // Split protocol
  const [, proto, uri] = url.match(/(\w+):\/\/(.*)/ )

  return createAuthLink(token, role).concat(new HttpLink({
    uri: `http://${uri}`,
    fetch
  }))
}
function createBrowserLink(url, token, role = 'anonymous') {
  // Split protocol
  const [, proto, uri] = url.match(/(\w+):\/\/(.*)/ )

  // Create an http link:
  const httpLink = createAuthLink(token, role).concat(new HttpLink({
    uri: `http://${uri}`,
    fetch
  }))

  // Create a WebSocket link:
  const wsLink = new WebSocketLink({
    uri: `ws://${uri}`,
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          authorization: token ? `Bearer ${token}` : "",
          'X-Hasura-Role': role
        }
      },
    }
  })


  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  )

  return link
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
        role: 'user',
        ...init
      })

      this.on('state', ({changed, current}) => {
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

      this.compute('graphqlClient', ['authToken', 'graphqlUri', 'role', 'server'],
        (authToken, graphqlUri, role, server) => 
          (authToken && graphqlUri) && (
            server ? 
              createClient(
                createServerLink(graphqlUri, authToken, role)
              )
              : 
              createClient(
                createBrowserLink(graphqlUri, authToken, role)
              )
          )
      )

      this.compute('graphql', ['graphqlClient'],
        (client) => client && createProvider(client)
      )
      
      this.compute('loggedIn', ['authToken'], authToken => !!authToken)

      this.compute('authTokenParsed', ['authToken'],
        (authToken) => jwt.parse(authToken)
      )

      this.compute('roles', ['authTokenParsed'],
        (token) => token && token['https://hasura.io/jwt/claims']['x-hasura-allowed-roles'] || []
      )
    }

    graphqlConnect(component, currentRole = 'user') {
      // Connect component to graphql
      console.log('client connected')

      // This is gonna be shitty with nested components, I'll deal with it later
      const { role : lastRole } = this.get()
      this.set({
        role: currentRole
      })
      component.on('destroy', () => {
        this.set({
          role: lastRole
        })
      })

      component.on('state', (state) => {
        const { authToken } = this.get()
        if (authToken) {
          connect.call(component, state);
        }
      })

      const state = component.get()
      connect.call(component, {
        changed: Object.keys(state).reduce((obj, key) => ({...obj, [key]: true}), {}),
        current: state,
        previous: {}
      });
    }
    
    async logout () {
      this.set({
        authToken: undefined
      })
      await fetch('/auth/logout')
    }

    getServerClient(url, token, role = 'user') {
      return createClient(createServerLink(url, token, role))
    }
  }