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
        fields: {
            history: {
                type: "auth_history",
                keyRaw: "history(order_by: {timestamp: desc})",

                selection: {
                    fields: {
                        timestamp: {
                            type: "timestamp",
                            keyRaw: "timestamp",
                            nullable: true
                        },

                        new_values: {
                            type: "jsonb",
                            keyRaw: "new_values",
                            nullable: true
                        },

                        old_values: {
                            type: "jsonb",
                            keyRaw: "old_values",
                            nullable: true
                        },

                        role: {
                            type: "String",
                            keyRaw: "role",
                            nullable: true
                        },

                        author: {
                            type: "auth_person",
                            keyRaw: "author",
                            nullable: true,

                            selection: {
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
                            }
                        },

                        person: {
                            type: "auth_person",
                            keyRaw: "person",

                            selection: {
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
                            }
                        },

                        id: {
                            type: "Int",
                            keyRaw: "id"
                        }
                    }
                }
            }
        }
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=68c2e31270e911e4046c671286cd4e160da129facbe514ad6348ac758e8d7b6e";