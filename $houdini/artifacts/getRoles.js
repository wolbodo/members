export default {
    name: "getRoles",
    kind: "HoudiniQuery",
    hash: "a6938fb1befb7f0bd4344ca4fa130b8780ec471cb55e6b136ad5171ae3c07dfc",

    raw: `query getRoles {
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