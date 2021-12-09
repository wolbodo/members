export type PersonRoles = {
    readonly "shape"?: PersonRoles$data,
    readonly "$fragments": {
        "PersonRoles": true
    }
};

export type PersonRoles$data = {
    readonly roles: ({
        readonly id: number,
        readonly role: string,
        readonly valid_from: string | null,
        readonly valid_till: string | null
    })[]
};