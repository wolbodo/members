export type CreatePerson = {
    readonly "input": CreatePerson$input,
    readonly "result": CreatePerson$result
};

export type CreatePerson$result = {
    readonly person: {
        readonly id: number,
        readonly name: string
    } | null
};

enum auth_person_constraint {
    person_email_key = "person_email_key",
    person_pkey = "person_pkey"
}

enum auth_person_update_column {
    address = "address",
    bankaccount = "bankaccount",
    city = "city",
    country = "country",
    created = "created",
    email = "email",
    firstname = "firstname",
    id = "id",
    key_code = "key_code",
    lastname = "lastname",
    modified = "modified",
    name = "name",
    note = "note",
    password = "password",
    phone = "phone",
    zipcode = "zipcode"
}

type String_comparison_exp = {
    _eq: string | null | undefined,
    _gt: string | null | undefined,
    _gte: string | null | undefined,
    _ilike: string | null | undefined,
    _in: (string)[] | null | undefined,
    _iregex: string | null | undefined,
    _is_null: boolean | null | undefined,
    _like: string | null | undefined,
    _lt: string | null | undefined,
    _lte: string | null | undefined,
    _neq: string | null | undefined,
    _nilike: string | null | undefined,
    _nin: (string)[] | null | undefined,
    _niregex: string | null | undefined,
    _nlike: string | null | undefined,
    _nregex: string | null | undefined,
    _nsimilar: string | null | undefined,
    _regex: string | null | undefined,
    _similar: string | null | undefined
};

type timestamptz_comparison_exp = {
    _eq: string | null | undefined,
    _gt: string | null | undefined,
    _gte: string | null | undefined,
    _in: (string)[] | null | undefined,
    _is_null: boolean | null | undefined,
    _lt: string | null | undefined,
    _lte: string | null | undefined,
    _neq: string | null | undefined,
    _nin: (string)[] | null | undefined
};

type Int_comparison_exp = {
    _eq: number | null | undefined,
    _gt: number | null | undefined,
    _gte: number | null | undefined,
    _in: (number)[] | null | undefined,
    _is_null: boolean | null | undefined,
    _lt: number | null | undefined,
    _lte: number | null | undefined,
    _neq: number | null | undefined,
    _nin: (number)[] | null | undefined
};

type jsonb_comparison_exp = {
    _contained_in: object | null | undefined,
    _contains: object | null | undefined,
    _eq: object | null | undefined,
    _gt: object | null | undefined,
    _gte: object | null | undefined,
    _has_key: string | null | undefined,
    _has_keys_all: (string)[] | null | undefined,
    _has_keys_any: (string)[] | null | undefined,
    _in: (object)[] | null | undefined,
    _is_null: boolean | null | undefined,
    _lt: object | null | undefined,
    _lte: object | null | undefined,
    _neq: object | null | undefined,
    _nin: (object)[] | null | undefined
};

type timestamp_comparison_exp = {
    _eq: string | null | undefined,
    _gt: string | null | undefined,
    _gte: string | null | undefined,
    _in: (string)[] | null | undefined,
    _is_null: boolean | null | undefined,
    _lt: string | null | undefined,
    _lte: string | null | undefined,
    _neq: string | null | undefined,
    _nin: (string)[] | null | undefined
};

type auth_history_bool_exp = {
    _and: (auth_history_bool_exp)[] | null | undefined,
    _not: auth_history_bool_exp | null | undefined,
    _or: (auth_history_bool_exp)[] | null | undefined,
    author: auth_person_bool_exp | null | undefined,
    author_id: Int_comparison_exp | null | undefined,
    id: Int_comparison_exp | null | undefined,
    new_values: jsonb_comparison_exp | null | undefined,
    old_values: jsonb_comparison_exp | null | undefined,
    person: auth_person_bool_exp | null | undefined,
    person_id: Int_comparison_exp | null | undefined,
    role: String_comparison_exp | null | undefined,
    timestamp: timestamp_comparison_exp | null | undefined
};

type auth_person_role_bool_exp = {
    _and: (auth_person_role_bool_exp)[] | null | undefined,
    _not: auth_person_role_bool_exp | null | undefined,
    _or: (auth_person_role_bool_exp)[] | null | undefined,
    id: Int_comparison_exp | null | undefined,
    person: auth_person_bool_exp | null | undefined,
    person_id: Int_comparison_exp | null | undefined,
    role: String_comparison_exp | null | undefined,
    valid_from: timestamptz_comparison_exp | null | undefined,
    valid_till: timestamptz_comparison_exp | null | undefined
};

type auth_person_bool_exp = {
    _and: (auth_person_bool_exp)[] | null | undefined,
    _not: auth_person_bool_exp | null | undefined,
    _or: (auth_person_bool_exp)[] | null | undefined,
    address: String_comparison_exp | null | undefined,
    bankaccount: String_comparison_exp | null | undefined,
    city: String_comparison_exp | null | undefined,
    country: String_comparison_exp | null | undefined,
    created: timestamptz_comparison_exp | null | undefined,
    email: String_comparison_exp | null | undefined,
    firstname: String_comparison_exp | null | undefined,
    history: auth_history_bool_exp | null | undefined,
    id: Int_comparison_exp | null | undefined,
    key_code: String_comparison_exp | null | undefined,
    lastname: String_comparison_exp | null | undefined,
    modified: timestamptz_comparison_exp | null | undefined,
    name: String_comparison_exp | null | undefined,
    note: String_comparison_exp | null | undefined,
    password: String_comparison_exp | null | undefined,
    phone: String_comparison_exp | null | undefined,
    roles: auth_person_role_bool_exp | null | undefined,
    zipcode: String_comparison_exp | null | undefined
};

type auth_person_on_conflict = {
    constraint: auth_person_constraint,
    update_columns: (auth_person_update_column)[],
    where: auth_person_bool_exp | null | undefined
};

type auth_person_obj_rel_insert_input = {
    data: auth_person_insert_input,
    on_conflict: auth_person_on_conflict | null | undefined
};

type auth_history_insert_input = {
    author: auth_person_obj_rel_insert_input | null | undefined,
    author_id: number | null | undefined,
    id: number | null | undefined,
    new_values: object | null | undefined,
    old_values: object | null | undefined,
    person: auth_person_obj_rel_insert_input | null | undefined,
    person_id: number | null | undefined,
    role: string | null | undefined,
    timestamp: string | null | undefined
};

type auth_history_arr_rel_insert_input = {
    data: (auth_history_insert_input)[]
};

type auth_person_role_insert_input = {
    id: number | null | undefined,
    person: auth_person_obj_rel_insert_input | null | undefined,
    person_id: number | null | undefined,
    role: string | null | undefined,
    valid_from: string | null | undefined,
    valid_till: string | null | undefined
};

enum auth_person_role_constraint {
    person_role_pkey = "person_role_pkey"
}

enum auth_person_role_update_column {
    id = "id",
    person_id = "person_id",
    role = "role",
    valid_from = "valid_from",
    valid_till = "valid_till"
}

type auth_person_role_on_conflict = {
    constraint: auth_person_role_constraint,
    update_columns: (auth_person_role_update_column)[],
    where: auth_person_role_bool_exp | null | undefined
};

type auth_person_role_arr_rel_insert_input = {
    data: (auth_person_role_insert_input)[],
    on_conflict: auth_person_role_on_conflict | null | undefined
};

type auth_person_insert_input = {
    address: string | null | undefined,
    bankaccount: string | null | undefined,
    city: string | null | undefined,
    country: string | null | undefined,
    created: string | null | undefined,
    email: string | null | undefined,
    firstname: string | null | undefined,
    history: auth_history_arr_rel_insert_input | null | undefined,
    id: number | null | undefined,
    key_code: string | null | undefined,
    lastname: string | null | undefined,
    modified: string | null | undefined,
    name: string | null | undefined,
    note: string | null | undefined,
    password: string | null | undefined,
    phone: string | null | undefined,
    roles: auth_person_role_arr_rel_insert_input | null | undefined,
    zipcode: string | null | undefined
};

export type CreatePerson$input = {
    person: auth_person_insert_input
};