import { AStarAlgorithm } from '../pathfinder/algorithms/a-star.algorithm';
import { PathfinderFactory } from '../pathfinder/pathfinder.factory';

export interface Field2D {
    x: number;
    z: number;
    blocked?: boolean;
}

export class Map2D<T extends Field2D> {
    static create<T extends Field2D>(width: number, height: number, creator: (x: number, z: number) => T = (x, z) => ({ x, z } as T)): Map2D<T> {
        const map: T[][] = [];
        for (let z = 0; z < height; ++z) {
            const row: T[] = [];
            map.push(row);
            for (let x = 0; x < width; ++x) {
                row.push(creator(x, z));
            }
        }

        return new Map2D(width, height, map);
    }

    constructor(protected readonly width: number, protected readonly height: number, protected readonly map: T[][]) {}

    get(x: number, z: number): T | undefined {
        return this.map[z]?.[x];
    }

    *fields(): Iterable<T> {
        for (const row of this.map) {
            for (const field of row) {
                yield field;
            }
        }
    }
}

PathfinderFactory.register<Map2D<Field2D>>({
    canHandle(map: unknown): map is Map2D<Field2D> {
        return typeof map === 'object' && map instanceof Map2D;
    },
    create(map: Map2D<Field2D>) {
        return new AStarAlgorithm<Field2D>(
            {
                getConnectedNodes(node: Field2D): Iterable<Field2D> {
                    const left = map.get(node.x - 1, node.z);
                    const right = map.get(node.x + 1, node.z);
                    const bottom = map.get(node.x, node.z - 1);
                    const top = map.get(node.x, node.z + 1);

                    const ret: Field2D[] = [];

                    if (left) ret.push(left);
                    if (right) ret.push(right);
                    if (bottom) ret.push(bottom);
                    if (top) ret.push(top);

                    return ret;
                }
            },
            {
                calculateRouteCost(_from: Field2D, to: Field2D) {
                    return to.blocked ? 1_000_000 : 1;
                },
                predictCostTo(from: Field2D, to: Field2D) {
                    return Math.abs(from.x - to.x) + Math.abs(from.z - to.z);
                }
            }
        );
    }
});
