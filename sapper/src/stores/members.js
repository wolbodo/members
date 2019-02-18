import gql from 'graphql-tag'

export default BaseStore =>
  class Store extends BaseStore {
    async addMember (member) {
      const res = await this.gqlMutation({
        mutation: gql`
        mutation (
          $name: String!,
          $firstname: String,
          $lastname: String,
          $email: String,
          $phone: String,
          $address: String,
          $zipcode: String,
          $city: String,
          $country: String,
          $member_roles: active_member_role_arr_rel_insert_input = {data: []},
        ) {
          insert_member(objects: [{
            name: $name
            firstname: $firstname
            lastname: $lastname
            email: $email
            phone: $phone
            address: $address
            zipcode: $zipcode
            city: $city
            country: $country,
            member_roles: $member_roles
          }]) {
            affected_rows
            __typename
          }
        }`,
        variables: {
          ...member
          // member_roles: [
          //   // { role_id: 2 } // role == 'member'
          // ]
        },
        permission: 'member:create'
      })
      return res
    }

    async updateMember (id, data, permission = 'member:update') {
      try {
        const res = await this.gqlMutation({
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
          },
          permission
        })
        this.notify('info', `Edited ${res.data.update_member.affected_rows} rows`)
        return res
      } catch (error) {
        console.log(error)
      }
    }

    async addMemberRole (memberId, roleId) {
      try {
        const res = await this.gqlMutation({
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
        console.log('Added member to role:', res)
        return res
      } catch (error) {
        console.log(error)
      }
    }
    async removeMemberRole (memberId, roleId) {
      try {
        const res = await this.gqlMutation({
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
        console.log('Added member to role:', res)
        return res
      } catch (error) {
        console.log(error)
      }
    }

    async allRoles () {
      try {
        const { data } = await this.gqlQuery({
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
