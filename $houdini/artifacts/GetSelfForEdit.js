export default {
    name: "GetSelfForEdit",
    kind: "HoudiniQuery",
    hash: "ec6013ed748878383e71c87687b35e8dbd5c346f4e5e7b683f852e7153183b1c",

    raw: `query GetSelfForEdit($id: Int!) {
  auth_person_by_pk(id: $id) {
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
    bankaccount
  }
}
`,

    rootType: "query_root",

    selection: {
        fields: {
            auth_person_by_pk: {
                type: "auth_person",
                keyRaw: "auth_person_by_pk(id: $id)",
                nullable: true,

                selection: {
                    fields: {
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
                        }
                    }
                }
            }
        }
    },

    input: {
        fields: {
            id: "Int"
        },

        types: {}
    },

    policy: "CacheOrNetwork",
    partial: false
};

"HoudiniHash=d81bbdab05881b62f866c51ca9611948ec510c911fc95ab87da1941381adaa3f";