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
        fields: {
            insert_auth_person_role_one: {
                type: "auth_person_role",
                keyRaw: "insert_auth_person_role_one(object: {person_id: $personId, role: $role})",
                nullable: true,

                selection: {
                    fields: {
                        id: {
                            type: "Int",
                            keyRaw: "id"
                        }
                    }
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

"HoudiniHash=ac8708760013e6a94523872fdb03b06b2939f8505b6651d6b5978b433a875fe1";