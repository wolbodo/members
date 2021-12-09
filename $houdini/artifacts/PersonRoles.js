export default {
    name: "PersonRoles",
    kind: "HoudiniFragment",
    hash: "514cd6af0e411034a064b1f814babf04c3b1fd6dae83424e9e38eaa4694e947f",

    raw: `fragment PersonRoles on auth_person {
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