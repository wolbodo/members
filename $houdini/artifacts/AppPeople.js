export default {
    name: "AppPeople",
    kind: "HoudiniQuery",
    hash: "877c71bd12c8214fbd05864b27a3533db438f046738d11566eb519a6305819e6",

    raw: `query AppPeople($where: auth_person_bool_exp = {}) {
  people: auth_person(order_by: {name: asc}, where: $where) {
    name
    email
    phone
    address
    city
    firstname
    lastname
    roles(where: {valid_till: {_is_null: true}, valid_from: {_lte: "NOW()"}}) {
      role
      id
    }
    id
  }
}
`,

    rootType: "query_root",

    selection: {
        people: {
            type: "auth_person",
            keyRaw: "people(order_by: {name: asc}, where: $where)",

            fields: {
                name: {
                    type: "String",
                    keyRaw: "name"
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

                city: {
                    type: "String",
                    keyRaw: "city"
                },

                firstname: {
                    type: "String",
                    keyRaw: "firstname"
                },

                lastname: {
                    type: "String",
                    keyRaw: "lastname"
                },

                roles: {
                    type: "auth_person_role",
                    keyRaw: "roles(where: {valid_till: {_is_null: true}, valid_from: {_lte: \"NOW()\"}})",

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
                },

                id: {
                    type: "Int",
                    keyRaw: "id"
                }
            }
        }
    },

    input: {
        fields: {
            where: "auth_person_bool_exp"
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
            }
        }
    },

    policy: "NetworkOnly"
};