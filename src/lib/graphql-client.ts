import { GraphQLClient } from 'graphql-request'
import { GRAPHQL_ENDPOINT } from '$lib/config'
export { gql } from 'graphql-request'


export const client = new GraphQLClient(GRAPHQL_ENDPOINT)
