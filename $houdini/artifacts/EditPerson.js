export default {
    name: "EditPerson",
    kind: "HoudiniMutation",
    hash: "337555f65fdff4f634bd8dcc29bb421b51092231812ca1dbb92cd4f23c551350",

    raw: `mutation EditPerson($id: Int!, $data: auth_person_set_input!) {
  person: update_auth_person(where: {id: {_eq: $id}}, _set: $data) {
    returning {
      id
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
      modified
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
                        id: {
                            type: "Int",
                            keyRaw: "id"
                        },

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

                        modified: {
                            type: "timestamptz",
                            keyRaw: "modified"
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