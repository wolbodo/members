export default {
    name: "AllMail",
    kind: "HoudiniQuery",
    hash: "62847447034261f70697a716aa77ddde19918f45ca6279ef2c9e8321a3ab09ac",

    raw: `query AllMail {
  mails: mail_entries(order_by: {created: desc}, limit: 100) {
    id
    status
    person {
      name
      email
      id
    }
    template
    created
  }
}
`,

    rootType: "query_root",

    selection: {
        mails: {
            type: "mail_entries",
            keyRaw: "mails(order_by: {created: desc}, limit: 100)",

            fields: {
                id: {
                    type: "Int",
                    keyRaw: "id"
                },

                status: {
                    type: "status",
                    keyRaw: "status"
                },

                person: {
                    type: "auth_person",
                    keyRaw: "person",

                    fields: {
                        name: {
                            type: "String",
                            keyRaw: "name"
                        },

                        email: {
                            type: "String",
                            keyRaw: "email"
                        },

                        id: {
                            type: "Int",
                            keyRaw: "id"
                        }
                    }
                },

                template: {
                    type: "String",
                    keyRaw: "template"
                },

                created: {
                    type: "timestamptz",
                    keyRaw: "created"
                }
            }
        }
    },

    policy: "NetworkOnly"
};