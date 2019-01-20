

export default BaseStore =>
  class Store extends BaseStore {

    logout() {
      this.set({
        authToken: undefined
      })
    }
  }
