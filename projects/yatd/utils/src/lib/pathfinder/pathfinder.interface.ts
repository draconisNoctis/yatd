export interface RouteInfo<T> {
    path: T[];
    costs: number;
}

export interface PathfinderAlgorithmStatic<M, T> {
    new (map: M): PathfinderAlgorithm<T>;
}

export interface PathfinderAlgorithm<T> {
    findShortestPath(from: T, to: T): RouteInfo<T> | undefined;
}
