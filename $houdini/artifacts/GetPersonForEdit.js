export default {
    name: "GetPersonForEdit",
    kind: "HoudiniQuery",
    hash: "62459e312a24361e4978a2e21f8ca6e30b0cb98c87da6233c569fb497e106edb",

    raw: `query GetPersonForEdit($name: String, $isSelf: Boolean = false) {
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
    bankaccount @include(if: $isSelf)
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