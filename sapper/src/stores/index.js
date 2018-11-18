

import { Store as BaseStore } from 'svelte/store.js';

import graphqlStore from './graphql'


export default function createStore(data) {
  const Store = graphqlStore(BaseStore)
  return new Store(data)
}