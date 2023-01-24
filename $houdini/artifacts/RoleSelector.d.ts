export type RoleSelector = {
    readonly "shape"?: RoleSelector$data;
    readonly "$fragments": {
        "RoleSelector": true;
    };
};

export type RoleSelector$data = {
    readonly roles: ({
        readonly id: number;
        readonly role: string;
        readonly valid_from: string | null;
        readonly valid_till: string | null;
    })[];
};