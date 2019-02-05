

import { Store as BaseStore } from 'svelte/store.js';

import graphqlStore from '@dxlb/svelte-graphql-store'
import membersStore from './members'
import authStore from './auth'
import notificationStore from './notifications'

function chain(first, ...rest) {
  if (rest.length) {
    return store => chain(...rest)(first(store))
  } else {
    return store => first(store)
  }
}

export default function createStore(data) {
  const Store = chain(
    graphqlStore,
    membersStore,
    authStore,
    notificationStore
  )(BaseStore)
  return new Store(data)
}