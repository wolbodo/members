export type AllRolesForOptions = {
    readonly "input": AllRolesForOptions$input;
    readonly "result": AllRolesForOptions$result | undefined;
};

export type AllRolesForOptions$result = {
    readonly auth_person_role: ({
        readonly role: string;
    })[];
};

export type AllRolesForOptions$input = null;