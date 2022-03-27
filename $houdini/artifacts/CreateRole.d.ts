export type CreateRole = {
    readonly "input": CreateRole$input,
    readonly "result": CreateRole$result | undefined
};

export type CreateRole$result = {
    readonly insert_auth_person_role_one: {
        readonly id: number
    } | null
};

export type CreateRole$input = {
    personId: number,
    role: string
};