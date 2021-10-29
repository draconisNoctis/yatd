import { AbstractMesh, AssetContainer, Scene, TransformNode } from '@babylonjs/core';

export interface ObjectDefinition<T extends Creators> {
    id: string;
    title?: string;
    description?: string;
    creator: T;
    dimensions?: ObjectDimensions;
}

export interface ObjectDimensions {
    height: number;
    width: number;
    depth: number;
}

export interface Creator<TYPE extends string, T> {
    type: TYPE;
    create(scene: Scene): Promise<T>;
}

export interface MeshCreator extends Creator<'mesh', AbstractMesh> {}
export interface AssetContainerCreator extends Creator<'assetContainer', AssetContainer> {}
export interface TransformNodeCreator extends Creator<'transformNode', TransformNode> {}

export type InferLoaderResult<T extends Creator<string, unknown>> = T extends Creator<string, infer TYPE> ? TYPE : never;

export type Creators = MeshCreator | AssetContainerCreator | TransformNodeCreator;
export type CreatorTypes = Creators['type'];
