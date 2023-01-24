export type StopRole = {
    readonly "input": StopRole$input;
    readonly "result": StopRole$result;
};

export type StopRole$result = {
    readonly update_auth_person_role_by_pk: {
        readonly id: number;
    } | null;
};

export type StopRole$input = {
    id: number;
};

export type StopRole$optimistic = {
    readonly update_auth_person_role_by_pk?: {
        readonly id?: number;
    } | null;
};