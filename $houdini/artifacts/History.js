export default {
    name: "History",
    kind: "HoudiniQuery",
    hash: "143ee0c7a3d99fa62d430dd1b77e29f90775e69c1bcd8de8af90deec4be8f326",

    raw: `query History {
  history: auth_history(order_by: {timestamp: desc}) {
    timestamp
    new_values
    old_values
    role
    author {
      name
      id
    }
    person {
      name
      id
    }
    id
  }
}
`,

    rootType: "query_root",

    selection: {
        history: {
            type: "auth_history",
            keyRaw: "history(order_by: {timestamp: desc})",

            fields: {
                timestamp: {
                    type: "timestamp",
                    keyRaw: "timestamp"
                },

                new_values: {
                    type: "jsonb",
                    keyRaw: "new_values"
                },

                old_values: {
                    type: "jsonb",
                    keyRaw: "old_values"
                },

                role: {
                    type: "String",
                    keyRaw: "role"
                },

                author: {
                    type: "auth_person",
                    keyRaw: "author",

                    fields: {
                        name: {
                            type: "String",
                            keyRaw: "name"
                        },

                        id: {
                            type: "Int",
                            keyRaw: "id"
                        }
                    }
                },

                person: {
                    type: "auth_person",
                    keyRaw: "person",

                    fields: {
                        name: {
                            type: "String",
                            keyRaw: "name"
                        },

                        id: {
                            type: "Int",
                            keyRaw: "id"
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

    policy: "NetworkOnly"
};