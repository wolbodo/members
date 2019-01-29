

import { Store as BaseStore } from 'svelte/store.js';

import graphqlStore from './graphql'
import membersStore from './members'


export default function createStore(data) {
  const Store = membersStore(graphqlStore(BaseStore))
  const store = new Store(data)
  console.log("Store:", store)
  return store
}