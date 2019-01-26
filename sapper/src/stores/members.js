import gql from 'graphql-tag';

export default BaseStore =>
  class Store extends BaseStore {
    async addMember(member) {
      const {graphqlClient} = this.get();
      try {
        return await graphqlClient.mutate({
          mutation: gql`
          mutation (
            $name: String,
            $fullname: String,
            $email: String,
            $phone: String,
            $streetname: String,
            $housenumber: numeric,
            $housenumberaddon: String,
            $zipcode: String,
            $city: String,
            $country: String
          ) {
            insert_member(objects: [{
              name: $name
              fullname: $fullname
              email: $email
              phone: $phone
              streetname: $streetname
              housenumber: $housenumber
              housenumberaddon: $housenumberaddon
              zipcode: $zipcode
              city: $city
              country: $country
            }]) {
              affected_rows
              __typename
            }
          }`,
          variables: member
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
