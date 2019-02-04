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

const { fetch } = fetchPonyfill();

// https://www.apollographql.com/docs/react/advanced/boost-migration.html

// function createAuthLink(token, getOptions = v => v {
//   return setContext((_, { headers }) => {
//     // return the headers to the context so httpLink can read them
//     return {
//       headers: {
//         ...headers,
//         authorization: token ? `Bearer ${token}` : "",
//         'X-Hasura-Role': getRole()
//       }
//     }
//   });
// }

function createServerLink(url, connParams = v => v) {
  // Split protocol
  const [, proto, uri] = url.match(/(\w+):\/\/(.*)/ )

  return new HttpLink({
    uri: `${proto}://${uri}`,
    fetch,
    connParams
  })
}
function createBrowserLink(url, connParams = v => v) {
  // Split protocol
  const [, proto, uri] = url.match(/(\w+):\/\/(.*)/ )

  const secure = proto === 'https'

  // Create an http link:
  const httpLink = new HttpLink({
    uri: `${proto}://${uri}`,
    fetch
  })

  // Create a WebSocket link:
  const wsLink = new WebSocketLink({
    uri: `${secure ? 'wss' : 'ws'}://${uri}`,
    options: {
      reconnect: true,
      connectionParams: connParams
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

function createClient({ graphqlUri, connParams = v => v, cacheInit }) {
  const cache = new InMemoryCache()
  if (cacheInit) {
    console.log("Using cache init", cacheInit)
    cache.restore(cacheInit)
  }
  return new ApolloClient({
    link: (global.WebSocket
      ? createBrowserLink(graphqlUri, connParams)
      : createServerLink(graphqlUri, connParams)
    ),
    cache
  });
}

export default BaseStore =>
  class Store extends BaseStore {
    constructor (init) {
      super(init)

      this.on('state', ({ changed, current }) => {
        const { graphqlUri, token } = current

        if (!(graphqlUri && token)) {
          console.warn("No token or uri for graphql client.")
          return
        }

        if (!this._gqlClient || changed.graphqlUri || changed.token) {
          console.log("Setting up gql client")
          this._gqlClient = createClient({
            graphqlUri, token,
            connParams: this.gqlConnParams.bind(this)
          })
        }
      })
    }

    gqlConnParams ( role ) {
      const { token, role: defaultRole } = this.get()
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : "",
          'X-Hasura-Role': role || defaultRole
        }
      }
    }

    gqlQuery ({ permission, ...options }) {
      if (!this._gqlClient) throw new Error('No grapqhl client present')
      return this._gqlClient.query({
        ...options,
        context: this.gqlConnParams(this.roleForPermission(permission))
      })
    }
    gqlMutation ({ permission, ...options }) {
      if (!this._gqlClient) throw new Error('No grapqhl client present')
      return this._gqlClient.mutate({
        ...options,
        context: this.gqlConnParams(this.roleForPermission(permission))
      })
    }
    gqlSubscription (options) {
      if (!this._gqlClient) throw new Error('No grapqhl client present')
      return this._gqlClient.subscribe(options)
    }
  }