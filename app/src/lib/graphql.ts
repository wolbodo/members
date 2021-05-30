import { browser } from '$app/env';
import { writable } from 'svelte/store'
import { gql, GraphQLClient } from 'graphql-request'
import { GRAPHQL_ENDPOINT } from '$lib/config'

console.log("has configured endpoint:", GRAPHQL_ENDPOINT)

export { gql }
export const user = writable(null)
export const client = new GraphQLClient(GRAPHQL_ENDPOINT)

const SESSION_USER = 'user'

if (browser) {
  const storage = sessionStorage.getItem(SESSION_USER)

  if (storage) {
    user.set(JSON.parse(storage))
  }
}


user.subscribe(user => {
  if (user?.token) {
    client.setHeaders({
      authorization: `Bearer ${user.token}`
    })
  }

  if (browser) {
    sessionStorage.setItem(SESSION_USER, JSON.stringify(user))
  }
})

