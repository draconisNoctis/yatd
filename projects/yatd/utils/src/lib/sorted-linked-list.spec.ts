import { TestBed } from '@angular/core/testing';

import { SortedLinkedList } from './sorted-linked-list';

describe('SortedList', () => {
    let list: SortedLinkedList<number>;

    beforeEach(() => {
        list = new SortedLinkedList<number>();
    });

    it('it should sort added values by priority', () => {
        list.add(4, 4);
        list.add(1, 1);
        list.add(3, 3);
        list.add(44, 4);
        list.add(2, 2);
        list.add(33, 3);

        expect([...list]).toEqual([1, 2, 3, 33, 4, 44]);
        expect([...list.entries()]).toEqual([
            [1, 1],
            [2, 2],
            [3, 3],
            [33, 3],
            [4, 4],
            [44, 4]
        ]);
    });

    describe('contains', () => {
        it('should indicate containing values/priorities', () => {
            list.add(1, 1);
            list.add(2, 2);
            list.add(2, 3);

            expect(list.contains(1)).toBeTrue();
            expect(list.contains(2)).toBeTrue();
            expect(list.contains(3)).toBeFalse();
            expect(list.contains(1, 1)).toBeTrue();
            expect(list.contains(1, 2)).toBeFalse();
            expect(list.contains(2, 3)).toBeTrue();
            expect(list.contains(2, 4)).toBeFalse();
        });
    });

    describe('remove', () => {
        it('should return first entry with matching value', () => {
            list.add(1, 1);
            list.add(1, 2);
            list.add(1, 3);

            list.remove(1);

            expect([...list.entries()]).toEqual([
                [1, 2],
                [1, 3]
            ]);
        });

        it('should return first entry with matching value and priority', () => {
            list.add(1, 1);
            list.add(1, 2);
            list.add(1, 3);

            list.remove(1, 2);

            expect([...list.entries()]).toEqual([
                [1, 1],
                [1, 3]
            ]);
        });
    });

    describe('popHead', () => {
        it('should return undefined on empty list', () => {
            expect(list.popHead()).toBeUndefined();
        });

        it('should return and consume head', () => {
            list.add(1, 1);
            list.add(2, 2);

            expect(list.popHead()).toBe(1);
            expect(list.popHead()).toBe(2);
            expect(list.popHead()).toBeUndefined();
        });
    });

    describe('popTail', () => {
        it('should return undefined on empty list', () => {
            expect(list.popTail()).toBeUndefined();
        });

        it('should return and consume tail', () => {
            list.add(1, 1);
            list.add(2, 2);

            expect(list.popTail()).toBe(2);
            expect(list.popTail()).toBe(1);
            expect(list.popTail()).toBeUndefined();
        });
    });

    describe('peekHead', () => {
        it('should return undefined on empty list', () => {
            expect(list.peekHead()).toBeUndefined();
        });

        it('should return head', () => {
            list.add(1, 1);
            list.add(2, 2);

            expect(list.peekHead()).toBe(1);
            expect(list.peekHead()).toBe(1);
        });
    });

    describe('peekTail', () => {
        it('should return undefined on empty list', () => {
            expect(list.peekTail()).toBeUndefined();
        });

        it('should return tail', () => {
            list.add(1, 1);
            list.add(2, 2);

            expect(list.peekTail()).toBe(2);
            expect(list.peekTail()).toBe(2);
        });
    });
});
