export type GetSelfForEdit = {
    readonly "input": GetSelfForEdit$input,
    readonly "result": GetSelfForEdit$result | undefined
};

export type GetSelfForEdit$result = {
    readonly auth_person_by_pk: {
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
    } | null
};

export type GetSelfForEdit$input = {
    id: number
};