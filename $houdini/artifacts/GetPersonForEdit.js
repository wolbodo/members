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
        fields: {
            auth_person: {
                type: "auth_person",
                keyRaw: "auth_person(limit: 1, where: {name: {_ilike: $name}})",

                selection: {
                    fields: {
                        roles: {
                            type: "auth_person_role",
                            keyRaw: "roles",

                            selection: {
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
                                        keyRaw: "valid_from",
                                        nullable: true
                                    },

                                    valid_till: {
                                        type: "timestamptz",
                                        keyRaw: "valid_till",
                                        nullable: true
                                    }
                                }
                            }
                        },

                        name: {
                            type: "String",
                            keyRaw: "name"
                        },

                        firstname: {
                            type: "String",
                            keyRaw: "firstname",
                            nullable: true
                        },

                        lastname: {
                            type: "String",
                            keyRaw: "lastname",
                            nullable: true
                        },

                        email: {
                            type: "String",
                            keyRaw: "email",
                            nullable: true
                        },

                        phone: {
                            type: "String",
                            keyRaw: "phone",
                            nullable: true
                        },

                        address: {
                            type: "String",
                            keyRaw: "address",
                            nullable: true
                        },

                        zipcode: {
                            type: "String",
                            keyRaw: "zipcode",
                            nullable: true
                        },

                        city: {
                            type: "String",
                            keyRaw: "city",
                            nullable: true
                        },

                        country: {
                            type: "String",
                            keyRaw: "country",
                            nullable: true
                        },

                        note: {
                            type: "String",
                            keyRaw: "note",
                            nullable: true
                        },

                        id: {
                            type: "Int",
                            keyRaw: "id"
                        },

                        created: {
                            type: "timestamptz",
                            keyRaw: "created",
                            nullable: true
                        },

                        modified: {
                            type: "timestamptz",
                            keyRaw: "modified",
                            nullable: true
                        },

                        bankaccount: {
                            type: "String",
                            keyRaw: "bankaccount",
                            nullable: true
                        },

                        key_code: {
                            type: "String",
                            keyRaw: "key_code",
                            nullable: true
                        }
                    }
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

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=da2b53068fadd8878fb23700501f2abc7b6f6aa5de0e7013956776244dd2c222";