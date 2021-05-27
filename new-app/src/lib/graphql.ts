import { writable } from 'svelte/store'
import { setHeaders, setHeader, GraphQLClient } from 'graphql-request'

export const user = writable()
export const client = new GraphQLClient('http://graphql.wolbodo/v1/graphql')
