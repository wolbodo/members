export type AllMail = {
    readonly "input": null,
    readonly "result": AllMail$result
};

export type AllMail$result = {
    readonly mails: ({
        readonly id: number,
        readonly status: string | null,
        readonly person: {
            readonly name: string,
            readonly email: string | null
        },
        readonly template: string,
        readonly created: string | null
    })[]
};