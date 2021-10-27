import { SortedLinkedList } from '../../sorted-linked-list';
import { PathfinderAlgorithm, RouteInfo } from '../pathfinder.interface';

export interface EdgeFinder<T> {
    getConnectedNodes(from: T): Iterable<T>;
}

export interface RouteCalculator<T> {
    calculateRouteCost(from: T, to: T): number;
    predictCostTo(from: T, to: T): number;
}

export class AStarAlgorithm<T extends object> implements PathfinderAlgorithm<T> {
    constructor(protected readonly edgeFinder: EdgeFinder<T>, protected readonly routeCalculator: RouteCalculator<T>) {}

    findShortestPath(from: T, to: T): RouteInfo<T> | undefined {
        const openlist: SortedLinkedList<T> = new SortedLinkedList<T>();
        const visited: WeakMap<T, RouteInfo<T>> = new WeakMap<T, RouteInfo<T>>();

        openlist.add(from, 0);
        visited.set(from, { path: [from], costs: 0 });

        const expand = (node: T, info: RouteInfo<T>): void => {
            for (const successor of this.edgeFinder.getConnectedNodes(node)) {
                if (visited.has(successor)) {
                    continue;
                }

                const costs = info.costs + this.routeCalculator.calculateRouteCost(node, successor);
                const predict = this.routeCalculator.predictCostTo(successor, to);

                const prio = openlist.getPriority(successor);

                if (prio !== undefined && prio < costs + predict) {
                    continue;
                }

                visited.set(successor, { path: [...info.path, successor], costs });

                if (prio !== undefined) {
                    openlist.remove(successor);
                }

                openlist.add(successor, costs + predict);
            }
        };

        while (!openlist.isEmpty()) {
            const current = openlist.popHead()!;

            if (current === to) {
                return visited.get(current);
            }

            expand(current, visited.get(current)!);
        }

        return undefined;
    }
}
