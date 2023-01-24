export type History = {
    readonly "input": History$input;
    readonly "result": History$result | undefined;
};

export type History$result = {
    readonly history: ({
        readonly timestamp: string | null;
        readonly new_values: object | null;
        readonly old_values: object | null;
        readonly role: string | null;
        readonly author: {
            readonly name: string;
        } | null;
        readonly person: {
            readonly name: string;
        };
    })[];
};

export type History$input = null;