export class AssertionError extends Error {
    constructor(message?: string) {
        super(`Assertion failed: ${message ?? 'assert'}`);
    }
}

export function assert(value: unknown, message?: string): asserts value {
    if (!value) {
        throw new AssertionError(message);
    }
}
