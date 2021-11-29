export type GetPerson = {
    readonly "input": GetPerson$input,
    readonly "result": GetPerson$result
};

export type GetPerson$result = {
    readonly auth_person: ({
        readonly name: string,
        readonly email: string | null,
        readonly id: number
    })[]
};

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

export type GetPerson$input = {
    where: auth_person_bool_exp | null | undefined,
    toggle: boolean | null | undefined
};