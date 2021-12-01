export default {
    name: "getPersonForEdit",
    kind: "HoudiniQuery",
    hash: "dc5012a587b283ddf46d194574f255579569367a77cb4d2d837f6fd2fb7183c3",

    raw: `query getPersonForEdit($name: String) {
  person: auth_person(where: {name: {_ilike: $name}}, limit: 1) {
    name
    roles {
      id
      role
      valid_from
      valid_till
    }
    id
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

                id: {
                    type: "Int",
                    keyRaw: "id"
                }
            }
        }
    },

    input: {
        fields: {
            name: "String"
        },

        types: {}
    },

    policy: "NetworkOnly"
};