export default {
    name: "StopRole",
    kind: "HoudiniMutation",
    hash: "842cf855537573001b87fc16b516c5d1a7c576b17b21e4b1b2e138e099ae3adb",

    raw: `mutation StopRole($id: Int!) {
  update_auth_person_role_by_pk(
    pk_columns: {id: $id}
    _set: {valid_till: "NOW()"}
  ) {
    id
  }
}
`,

    rootType: "mutation_root",

    selection: {
        fields: {
            update_auth_person_role_by_pk: {
                type: "auth_person_role",
                keyRaw: "update_auth_person_role_by_pk(_set: {valid_till: \"NOW()\"}, pk_columns: {id: $id})",
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
            id: "Int"
        },

        types: {}
    }
};

"HoudiniHash=04fd18560e63b51cf6f169c420bf8f254210c33b23ac392cbcd8f880dbd32122";