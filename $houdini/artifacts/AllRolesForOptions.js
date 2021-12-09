export default {
    name: "AllRolesForOptions",
    kind: "HoudiniQuery",
    hash: "aac96b20cfc9736c4bd30434e65a70d8b01d227803231d38437640989de018e1",

    raw: `query AllRolesForOptions {
  auth_person_role(distinct_on: role) {
    role
    id
  }
}
`,

    rootType: "query_root",

    selection: {
        auth_person_role: {
            type: "auth_person_role",
            keyRaw: "auth_person_role(distinct_on: role)",

            fields: {
                role: {
                    type: "String",
                    keyRaw: "role"
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