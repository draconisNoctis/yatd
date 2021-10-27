import { PathfinderAlgorithm } from './pathfinder.interface';

export type PathfinderFactoryObj<M, T> = {
    canHandle(this: void, map: unknown): map is M;
    create(this: void, map: M): PathfinderAlgorithm<T>;
};

export class PathfinderFactory {
    protected static readonly factories: PathfinderFactoryObj<any, any>[] = [];

    static register<M>(factory: PathfinderFactoryObj<M, any>): void {
        this.factories.push(factory);
    }

    static create<T>(map: unknown): PathfinderAlgorithm<T> {
        for (const { canHandle, create } of this.factories) {
            if (canHandle(map)) {
                return create(map);
            }
        }

        throw new Error(`Cannot create Pathfinder for ${map}`);
    }
}
