export default {
    name: "CreateRole",
    kind: "HoudiniMutation",
    hash: "da568eeae5ea82c4ac16c4bcfe9602b7c17d0641d28f11eef89b4341aa7ee941",

    raw: `mutation CreateRole($personId: Int!, $role: String!) {
  insert_auth_person_role_one(object: {person_id: $personId, role: $role}) {
    id
  }
}
`,

    rootType: "mutation_root",

    selection: {
        insert_auth_person_role_one: {
            type: "auth_person_role",
            keyRaw: "insert_auth_person_role_one(object: {person_id: $personId, role: $role})",

            fields: {
                id: {
                    type: "Int",
                    keyRaw: "id"
                }
            }
        }
    },

    input: {
        fields: {
            personId: "Int",
            role: "String"
        },

        types: {}
    }
};