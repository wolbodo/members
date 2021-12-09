export default {
    name: "RoleSelector",
    kind: "HoudiniFragment",
    hash: "9da44d7b77de1c6278ddf16c2fae14c63a9f9d951b7859c3e5dcb237870cb614",

    raw: `fragment RoleSelector on auth_person {
  roles {
    id
    role
    valid_from
    valid_till
  }
}
`,

    rootType: "auth_person",

    selection: {
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
        }
    }
};