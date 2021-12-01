export type getPersonForEdit = {
    readonly "input": getPersonForEdit$input,
    readonly "result": getPersonForEdit$result
};

export type getPersonForEdit$result = {
    readonly person: ({
        readonly name: string,
        readonly roles: ({
            readonly id: number,
            readonly role: string,
            readonly valid_from: string | null,
            readonly valid_till: string | null
        })[]
    })[]
};

export type getPersonForEdit$input = {
    name: string | null | undefined
};