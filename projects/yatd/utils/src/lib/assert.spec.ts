import { assert, AssertionError } from './assert';

describe('assert', () => {
    for (const falsyValue of [false, 0, -0, 0n, '', null, undefined, NaN]) {
        it(`should throw on ${falsyValue}`, () => {
            expect(() => assert(falsyValue)).toThrow();
        });
    }

    it('should throw with default error message', () => {
        expect(() => assert(false)).toThrow(new AssertionError());
    });

    it('should throw with provided error message', () => {
        expect(() => assert(false, 'foobar')).toThrow(new AssertionError('foobar'));
    });

    it('should NOT throw on truthy value', () => {
        expect(assert(true)).toBeUndefined();
        expect(assert(1)).toBeUndefined();
        expect(assert(-1)).toBeUndefined();
        expect(assert(1n)).toBeUndefined();
        expect(assert('foobar')).toBeUndefined();
        expect(assert([])).toBeUndefined();
        expect(assert({})).toBeUndefined();
    });
});
