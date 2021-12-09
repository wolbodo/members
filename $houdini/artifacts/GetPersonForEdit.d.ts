export type GetPersonForEdit = {
    readonly "input": GetPersonForEdit$input,
    readonly "result": GetPersonForEdit$result
};

export type GetPersonForEdit$result = {
    readonly auth_person: ({
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
        readonly bankaccount: string | null,
        readonly $fragments: {
            RoleSelector: true
        }
    })[]
};

export type GetPersonForEdit$input = {
    name: string | null | undefined,
    isSelf: boolean | null | undefined
};