import gql from 'graphql-tag';

export default BaseStore =>
  class Store extends BaseStore {
    async addMember(member) {
      const {graphqlClient} = this.get();
      try {
        return await graphqlClient.mutate({
          mutation: gql`
          mutation (
            $name: String!,
            $fullname: String!,
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
        return error
      }
    }

    async updateMember(id, data) {
      const {graphqlClient} = this.get();
      try {
        return await graphqlClient.mutate({
          mutation: gql`
          mutation (
            $id: Int!,
            $data: member_set_input
          ) {
            update_member(
              _set:$data,
              where:{
                id: {
                  _eq: $id
                }
              }
            ) {
              affected_rows
            }
          }`,
          variables: {
            id: id,
            data: data
          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    async addMemberRole(memberId, roleId) {
      const {graphqlClient} = this.get();
      try {
        const res = await graphqlClient.mutate({
          mutation: gql`mutation addMemberRole($memberId: Int!, $roleId:Int!) {
            insert_member_role(objects:{
              member_id:$memberId,
              role_id:$roleId
            }) {
              affected_rows
            }
          }`,
          variables: {
            memberId, roleId
          }
        })
        console.log("Added member to role:", res)
        return res
      } catch (error) {
        console.log(error)
      }
    }
    async removeMemberRole(memberId, roleId) {
      const {graphqlClient} = this.get();
      try {
        const res = await graphqlClient.mutate({
          mutation: gql`mutation addMemberRole($memberId: Int!, $roleId:Int!) {
            delete_member_role(where:{
              member_id:{_eq: $memberId},
              role_id:{_eq: $roleId}
            }) {
              affected_rows
            }
          }`,
          variables: {
            memberId, roleId
          }
        })
        console.log("Added member to role:", res)
        return res
      } catch (error) {
        console.log(error)
      }
    }

    async allRoles() {
      const {graphqlClient} = this.get();
      try {
        const { data } = await graphqlClient.query({
          query: gql`{
            role {
              id name
              description
            }
          }`
        })
        return data.role
      } catch (error) {
        console.log(error)
      }
    }
  }
