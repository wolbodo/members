export type EditSelf = {
    readonly "input": EditSelf$input,
    readonly "result": EditSelf$result | undefined
};

export type EditSelf$result = {
    readonly person: {
        readonly returning: ({
            readonly name: string,
            readonly firstname: string | null,
            readonly lastname: string | null,
            readonly email: string | null,
            readonly phone: string | null,
            readonly address: string | null,
            readonly zipcode: string | null,
            readonly city: string | null,
            readonly country: string | null,
            readonly note: string | null,
            readonly id: number,
            readonly created: string | null,
            readonly modified: string | null,
            readonly bankaccount: string | null
        })[]
    } | null
};

type auth_person_set_input = {
    address: string | null | undefined,
    bankaccount: string | null | undefined,
    city: string | null | undefined,
    country: string | null | undefined,
    created: string | null | undefined,
    email: string | null | undefined,
    firstname: string | null | undefined,
    id: number | null | undefined,
    key_code: string | null | undefined,
    lastname: string | null | undefined,
    modified: string | null | undefined,
    name: string | null | undefined,
    note: string | null | undefined,
    password: string | null | undefined,
    phone: string | null | undefined,
    zipcode: string | null | undefined
};

export type EditSelf$input = {
    id: number,
    data: auth_person_set_input
};