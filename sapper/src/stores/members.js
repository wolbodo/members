import gql from 'graphql-tag';

export default BaseStore =>
  class Store extends BaseStore {
    async addMember(member) {
      const {graphqlClient} = this.get();
      try {
        await graphqlClient.mutate({
          mutation: gql`
          mutation ($member: member_insert_input!) {
            insert_member(objects: [$member]) {
              affected_rows
              __typename
            }
          }`,
          variables: { member }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
