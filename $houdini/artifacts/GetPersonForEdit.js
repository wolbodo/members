export default {
    name: "GetPersonForEdit",
    kind: "HoudiniQuery",
    hash: "3b696f6fc9d8f2fa178e88044a9c348368a6dcb146db2ca7ce72f57aa2abe0ee",

    raw: `query GetPersonForEdit($name: String, $isSelf: Boolean = false) {
  person: auth_person(where: {name: {_ilike: $name}}, limit: 1) {
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
    roles {
      id
      role
      valid_from
      valid_till
    }
    bankaccount @include(if: $isSelf)
  }
}
`,

    rootType: "query_root",

    selection: {
        person: {
            type: "auth_person",
            keyRaw: "person(where: {name: {_ilike: $name}}, limit: 1)",

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

                roles: {
                    type: "auth_person_role",
                    keyRaw: "roles",

                    fields: {
                        id: {
                            type: "Int",
                            keyRaw: "id"
                        },

                        role: {
                            type: "String",
                            keyRaw: "role"
                        },

                        valid_from: {
                            type: "timestamptz",
                            keyRaw: "valid_from"
                        },

                        valid_till: {
                            type: "timestamptz",
                            keyRaw: "valid_till"
                        }
                    }
                },

                bankaccount: {
                    type: "String",
                    keyRaw: "bankaccount"
                }
            }
        }
    },

    input: {
        fields: {
            name: "String",
            isSelf: "Boolean"
        },

        types: {}
    },

    policy: "NetworkOnly"
};