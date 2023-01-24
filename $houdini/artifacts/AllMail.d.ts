export type AllMail = {
    readonly "input": AllMail$input;
    readonly "result": AllMail$result | undefined;
};

export type AllMail$result = {
    readonly mails: ({
        readonly id: number;
        readonly status: string | null;
        readonly person: {
            readonly name: string;
            readonly email: string | null;
        };
        readonly template: string;
        readonly created: string | null;
    })[];
};

export type AllMail$input = null;