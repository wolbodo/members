export default {
    name: "CreatePerson",
    kind: "HoudiniMutation",
    hash: "e6849fb39d68dae956faa6cba9bba7687afce58b9395ff7b4df481edbdb460ec",

    raw: `mutation CreatePerson($person: auth_person_insert_input!) {
  person: insert_auth_person_one(object: $person) {
    id
    name
  }
}
`,

    rootType: "mutation_root",

    selection: {
        person: {
            type: "auth_person",
            keyRaw: "person(object: $person)",

            fields: {
                id: {
                    type: "Int",
                    keyRaw: "id"
                },

                name: {
                    type: "String",
                    keyRaw: "name"
                }
            }
        }
    },

    input: {
        fields: {
            person: "auth_person_insert_input"
        },

        types: {
            String_comparison_exp: {
                _eq: "String",
                _gt: "String",
                _gte: "String",
                _ilike: "String",
                _in: "String",
                _iregex: "String",
                _is_null: "Boolean",
                _like: "String",
                _lt: "String",
                _lte: "String",
                _neq: "String",
                _nilike: "String",
                _nin: "String",
                _niregex: "String",
                _nlike: "String",
                _nregex: "String",
                _nsimilar: "String",
                _regex: "String",
                _similar: "String"
            },

            timestamptz_comparison_exp: {
                _eq: "timestamptz",
                _gt: "timestamptz",
                _gte: "timestamptz",
                _in: "timestamptz",
                _is_null: "Boolean",
                _lt: "timestamptz",
                _lte: "timestamptz",
                _neq: "timestamptz",
                _nin: "timestamptz"
            },

            Int_comparison_exp: {
                _eq: "Int",
                _gt: "Int",
                _gte: "Int",
                _in: "Int",
                _is_null: "Boolean",
                _lt: "Int",
                _lte: "Int",
                _neq: "Int",
                _nin: "Int"
            },

            jsonb_comparison_exp: {
                _contained_in: "jsonb",
                _contains: "jsonb",
                _eq: "jsonb",
                _gt: "jsonb",
                _gte: "jsonb",
                _has_key: "String",
                _has_keys_all: "String",
                _has_keys_any: "String",
                _in: "jsonb",
                _is_null: "Boolean",
                _lt: "jsonb",
                _lte: "jsonb",
                _neq: "jsonb",
                _nin: "jsonb"
            },

            timestamp_comparison_exp: {
                _eq: "timestamp",
                _gt: "timestamp",
                _gte: "timestamp",
                _in: "timestamp",
                _is_null: "Boolean",
                _lt: "timestamp",
                _lte: "timestamp",
                _neq: "timestamp",
                _nin: "timestamp"
            },

            auth_history_bool_exp: {
                _and: "auth_history_bool_exp",
                _not: "auth_history_bool_exp",
                _or: "auth_history_bool_exp",
                author: "auth_person_bool_exp",
                author_id: "Int_comparison_exp",
                id: "Int_comparison_exp",
                new_values: "jsonb_comparison_exp",
                old_values: "jsonb_comparison_exp",
                person: "auth_person_bool_exp",
                person_id: "Int_comparison_exp",
                role: "String_comparison_exp",
                timestamp: "timestamp_comparison_exp"
            },

            auth_person_role_bool_exp: {
                _and: "auth_person_role_bool_exp",
                _not: "auth_person_role_bool_exp",
                _or: "auth_person_role_bool_exp",
                id: "Int_comparison_exp",
                person: "auth_person_bool_exp",
                person_id: "Int_comparison_exp",
                role: "String_comparison_exp",
                valid_from: "timestamptz_comparison_exp",
                valid_till: "timestamptz_comparison_exp"
            },

            auth_person_bool_exp: {
                _and: "auth_person_bool_exp",
                _not: "auth_person_bool_exp",
                _or: "auth_person_bool_exp",
                address: "String_comparison_exp",
                bankaccount: "String_comparison_exp",
                city: "String_comparison_exp",
                country: "String_comparison_exp",
                created: "timestamptz_comparison_exp",
                email: "String_comparison_exp",
                firstname: "String_comparison_exp",
                history: "auth_history_bool_exp",
                id: "Int_comparison_exp",
                key_code: "String_comparison_exp",
                lastname: "String_comparison_exp",
                modified: "timestamptz_comparison_exp",
                name: "String_comparison_exp",
                note: "String_comparison_exp",
                password: "String_comparison_exp",
                phone: "String_comparison_exp",
                roles: "auth_person_role_bool_exp",
                zipcode: "String_comparison_exp"
            },

            auth_person_on_conflict: {
                constraint: "auth_person_constraint",
                update_columns: "auth_person_update_column",
                where: "auth_person_bool_exp"
            },

            auth_person_obj_rel_insert_input: {
                data: "auth_person_insert_input",
                on_conflict: "auth_person_on_conflict"
            },

            auth_history_insert_input: {
                author: "auth_person_obj_rel_insert_input",
                author_id: "Int",
                id: "Int",
                new_values: "jsonb",
                old_values: "jsonb",
                person: "auth_person_obj_rel_insert_input",
                person_id: "Int",
                role: "String",
                timestamp: "timestamp"
            },

            auth_history_arr_rel_insert_input: {
                data: "auth_history_insert_input"
            },

            auth_person_role_insert_input: {
                id: "Int",
                person: "auth_person_obj_rel_insert_input",
                person_id: "Int",
                role: "String",
                valid_from: "timestamptz",
                valid_till: "timestamptz"
            },

            auth_person_role_on_conflict: {
                constraint: "auth_person_role_constraint",
                update_columns: "auth_person_role_update_column",
                where: "auth_person_role_bool_exp"
            },

            auth_person_role_arr_rel_insert_input: {
                data: "auth_person_role_insert_input",
                on_conflict: "auth_person_role_on_conflict"
            },

            auth_person_insert_input: {
                address: "String",
                bankaccount: "String",
                city: "String",
                country: "String",
                created: "timestamptz",
                email: "String",
                firstname: "String",
                history: "auth_history_arr_rel_insert_input",
                id: "Int",
                key_code: "String",
                lastname: "String",
                modified: "timestamptz",
                name: "String",
                note: "String",
                password: "String",
                phone: "String",
                roles: "auth_person_role_arr_rel_insert_input",
                zipcode: "String"
            }
        }
    }
};