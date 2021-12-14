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
        auth_person_by_pk: {
            type: "auth_person",
            keyRaw: "auth_person_by_pk(id: $id)",

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

                bankaccount: {
                    type: "String",
                    keyRaw: "bankaccount"
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

    policy: "NetworkOnly"
};