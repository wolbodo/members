

const intoQuery = ({ definitions, ...rest }) => (
  {
    definitions: definitions.map(
      def => ({
        ...def,
        operation: 'query',
      })),
    ...rest
  }
)

export function loadQueries (component, queries, { params = {}, role='member' } = {}) {
  component._subscriptions = []

  for (let query of queries) {
    if (query.type === 'subscription') {
      component._subscriptions.push(
        component.store.gqlSubscription({
          query: query.query,
          variables: params
        })
        .subscribe({
          next: d => query.success.call(component, d),
          error: e => query.error.call(component, e)
        })
      )
    } else {
      console.warn("Unmanaged query:", query)
    }
  }
}

export function stopQueries (component) {
  component._subscriptions.map(s => s.unsubscribe())
}

export async function preloadQueries (store, queries, { params = {}, role='member' } = {}) {
  const data = {}
  const { role: prevRole } = store.get()

  store.set({ role })
  try {

    for (let query of queries) {
      if (query.type === 'subscription') {

        console.log("Querying:", query.type)

        const res = await store.gqlQuery({
          query: intoQuery(query.query),
          variables: params
        })
        console.log(" -> Done:", res)

        query.success.call({
          set(newState) { Object.assign(data, newState) }
        }, res)
      }
    }
  } catch (e) {
    data.error = e
    console.log("Error in companies preload:", e)
  }
  store.set({ role: prevRole })
  return data
}