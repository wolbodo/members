import gql from 'graphql-tag';

export default BaseStore =>
  class Store extends BaseStore {
    async addUser(user) {
      const {graphqlClient} = this.get();
      try {
        await graphqlClient.mutate({
          mutation: gql`
          mutation($user: account_user_insert_input!) {
            insert_account_user (objects: [$user]) {
              affected_rows
            }
          }`,
          variables: { user }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
