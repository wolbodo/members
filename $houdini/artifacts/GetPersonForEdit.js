export default {
    name: "GetPersonForEdit",
    kind: "HoudiniQuery",
    hash: "0ef8f523f6d38098eb2ffb7300343e457cfeaa92afd8531c4f74e9f1375e4d5c",

    raw: `query GetPersonForEdit($name: String, $isBoard: Boolean = false) {
  auth_person(where: {name: {_ilike: $name}}, limit: 1) {
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
    ...RoleSelector
    bankaccount @include(if: $isBoard)
    key_code @include(if: $isBoard)
  }
}

fragment RoleSelector on auth_person {
  roles {
    id
    role
    valid_from
    valid_till
  }
}
`,

    rootType: "query_root",

    selection: {
        auth_person: {
            type: "auth_person",
            keyRaw: "auth_person(where: {name: {_ilike: $name}}, limit: 1)",

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
                },

                key_code: {
                    type: "String",
                    keyRaw: "key_code"
                }
            }
        }
    },

    input: {
        fields: {
            name: "String",
            isBoard: "Boolean"
        },

        types: {}
    },

    policy: "NetworkOnly"
};