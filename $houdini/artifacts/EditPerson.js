export default {
    name: "EditPerson",
    kind: "HoudiniMutation",
    hash: "cdd4267d26923dcb4d1d5858dc189c1937823d0d76cd0d932f00b017eecc7943",

    raw: `mutation EditPerson($id: Int!, $data: auth_person_set_input!) {
  person: update_auth_person(where: {id: {_eq: $id}}, _set: $data) {
    returning {
      name
      firstname
      lastname
      email
      phone
      address
      zipcode
      city
      country
      note
      id
      created
      modified
      bankaccount
      key_code
    }
  }
}
`,

    rootType: "mutation_root",

    selection: {
        person: {
            type: "auth_person_mutation_response",
            keyRaw: "person(where: {id: {_eq: $id}}, _set: $data)",

            fields: {
                returning: {
                    type: "auth_person",
                    keyRaw: "returning",

                    fields: {
                        name: {
                            type: "String",
                            keyRaw: "name"
                        },

                        firstname: {
                            type: "String",
                            keyRaw: "firstname"
                        },

                        lastname: {
                            type: "String",
                            keyRaw: "lastname"
                        },

                        email: {
                            type: "String",
                            keyRaw: "email"
                        },

                        phone: {
                            type: "String",
                            keyRaw: "phone"
                        },

                        address: {
                            type: "String",
                            keyRaw: "address"
                        },

                        zipcode: {
                            type: "String",
                            keyRaw: "zipcode"
                        },

                        city: {
                            type: "String",
                            keyRaw: "city"
                        },

                        country: {
                            type: "String",
                            keyRaw: "country"
                        },

                        note: {
                            type: "String",
                            keyRaw: "note"
                        },

                        id: {
                            type: "Int",
                            keyRaw: "id"
                        },

                        created: {
                            type: "timestamptz",
                            keyRaw: "created"
                        },

                        modified: {
                            type: "timestamptz",
                            keyRaw: "modified"
                        },

                        bankaccount: {
                            type: "String",
                            keyRaw: "bankaccount"
                        },

                        key_code: {
                            type: "String",
                            keyRaw: "key_code"
                        }
                    }
                }
            }
        }
    },

    input: {
        fields: {
            id: "Int",
            data: "auth_person_set_input"
        },

        types: {
            auth_person_set_input: {
                address: "String",
                bankaccount: "String",
                city: "String",
                country: "String",
                created: "timestamptz",
                email: "String",
                firstname: "String",
                id: "Int",
                key_code: "String",
                lastname: "String",
                modified: "timestamptz",
                name: "String",
                note: "String",
                password: "String",
                phone: "String",
                zipcode: "String"
            }
        }
    }
};