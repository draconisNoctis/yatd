import { assert } from '@yatd/utils';

interface INode<T> {
    value: T;
    priority: number;
    next?: INode<T>;
    previous?: INode<T>;
}

export class SortedLinkedList<T> {
    protected head?: INode<T>;
    protected tail?: INode<T>;

    add(value: T, priority: number): void {
        const node: INode<T> = { value, priority };
        if (!this.head || !this.tail) {
            this.head = this.tail = node;
        } else if (priority < this.head.priority) {
            node.next = this.head;
            this.head.previous = node;
            this.head = node;
        } else {
            let current = this.head.next;
            while (current) {
                if (priority < current.priority) {
                    node.next = current;
                    node.previous = current.previous;
                    current.previous!.next = node;
                    current.previous = node;
                    return;
                }
                current = current.next;
            }
            node.previous = this.tail;
            this.tail.next = node;
            this.tail = node;
        }
    }

    clear(): void {
        this.head = this.tail = undefined;
    }

    isEmpty(): boolean {
        return !this.head;
    }

    contains(value: T, priority?: number): boolean {
        for (const current of this.notes()) {
            if (current.value === value && (priority === undefined || current.priority === priority)) {
                return true;
            }
        }
        return false;
    }

    remove(value: T, priority?: number): boolean {
        for (const current of this.notes()) {
            if (current.value === value && (priority === undefined || current.priority === priority)) {
                if (this.head === this.tail && this.head === current) {
                    this.clear();
                }
                if (this.head === current) {
                    this.head = current.next!;
                    this.head.previous = undefined;
                } else if (this.tail === current) {
                    this.tail = current.previous!;
                    this.tail.next = undefined;
                } else {
                    current.previous!.next = current.next;
                    current.next!.previous = current.previous;
                }
                return true;
            }
        }
        return false;
    }

    getPriority(value: T): number | undefined {
        for (const current of this.notes()) {
            if (current.value === value) {
                return current.priority;
            }
        }
        return undefined;
    }

    *[Symbol.iterator](): Iterator<T> {
        for (const current of this.notes()) {
            yield current.value;
        }
    }

    *entries(): IterableIterator<[T, number]> {
        for (const current of this.notes()) {
            yield [current.value, current.priority];
        }
    }

    protected *notes(): IterableIterator<INode<T>> {
        let current = this.head;
        while (current) {
            yield current;
            assert(current !== current.next);
            current = current.next;
        }
    }

    popHead(): T | undefined {
        if (!this.head) {
            return undefined;
        }

        const head = this.head;

        if (this.head === this.tail) {
            this.clear();
        } else {
            this.head = head.next;
            this.head!.previous = undefined;
        }

        return head.value;
    }

    popTail(): T | undefined {
        if (!this.tail) {
            return undefined;
        }

        const tail = this.tail;

        if (this.tail === this.head) {
            this.tail = this.tail = undefined;
        } else {
            this.tail = tail.previous;
            this.tail!.next = undefined;
        }

        return tail.value;
    }

    peekHead(): T | undefined {
        return this.head?.value;
    }

    peekTail(): T | undefined {
        return this.tail?.value;
    }
}
