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
        fields: {
            mails: {
                type: "mail_entries",
                keyRaw: "mails(limit: 100, order_by: {created: desc})",

                selection: {
                    fields: {
                        id: {
                            type: "Int",
                            keyRaw: "id"
                        },

                        status: {
                            type: "status",
                            keyRaw: "status",
                            nullable: true
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

                                    email: {
                                        type: "String",
                                        keyRaw: "email",
                                        nullable: true
                                    },

                                    id: {
                                        type: "Int",
                                        keyRaw: "id"
                                    }
                                }
                            }
                        },

                        template: {
                            type: "String",
                            keyRaw: "template"
                        },

                        created: {
                            type: "timestamptz",
                            keyRaw: "created",
                            nullable: true
                        }
                    }
                }
            }
        }
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=2abc96f17911dbe9ba3eed501f0912f60ea6cd37e6763b526e8ab062478de5b5";