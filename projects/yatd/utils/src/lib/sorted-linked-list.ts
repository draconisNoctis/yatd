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

    *[Symbol.iterator](): Iterator<T> {
        let current = this.head;
        while (current) {
            yield current.value;
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
            this.head = this.tail = undefined;
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
