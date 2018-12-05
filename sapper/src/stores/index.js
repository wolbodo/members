

import { Store as BaseStore } from 'svelte/store.js';

import graphqlStore from './graphql'
import usersStore from './users'


export default function createStore(data) {
  const Store = usersStore(graphqlStore(BaseStore))
  return new Store(data)
}