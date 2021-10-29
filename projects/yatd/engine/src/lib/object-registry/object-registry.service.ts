import { Inject, Injectable } from '@angular/core';
import { Scene, TransformNode } from '@babylonjs/core';
import { assert } from '@yatd/utils';
import {
    Creators,
    ObjectDefinition,
    MeshCreator,
    AssetContainerCreator,
    InferLoaderResult,
    CreatorTypes,
    TransformNodeCreator
} from './object-registry.interfaces';
import { OBJECT_DEFINITIONS } from './object-registry.provider';

@Injectable({
    providedIn: 'root'
})
export class ObjectRegistryService {
    readonly registries: {
        [Loader in Creators as Loader['type']]: Map<string, ObjectDefinition<Loader>>;
    } = {
        mesh: new Map<string, ObjectDefinition<MeshCreator>>(),
        assetContainer: new Map<string, ObjectDefinition<AssetContainerCreator>>(),
        transformNode: new Map<string, ObjectDefinition<TransformNodeCreator>>()
    };

    constructor(@Inject(OBJECT_DEFINITIONS) definitions?: ObjectDefinition<Creators>[]) {
        if (definitions) {
            for (const definition of definitions) {
                this.register(definition);
            }
        }
    }

    register<LOADER extends Creators>(defintion: ObjectDefinition<LOADER>): void {
        (this.registries[defintion.creator.type] as Map<string, ObjectDefinition<LOADER>>).set(defintion.id, defintion);
    }

    get<LOADER extends Creators, T extends LOADER['type']>(type: T, id: string): ObjectDefinition<LOADER> {
        const registry = this.registries[type] as Map<string, ObjectDefinition<LOADER>>;
        const definition = registry.get(id);

        assert(definition, `object factory for '${type}/${id}' not found`);

        return definition;
    }

    create<T extends CreatorTypes, LOADER extends Extract<Creators, { type: T }>>(type: T, id: string, scene: Scene): Promise<InferLoaderResult<LOADER>> {
        return this.get(type, id).creator.create(scene) as Promise<InferLoaderResult<LOADER>>;
    }

    list(): Iterable<ObjectDefinition<Creators>>;
    list<LOADER extends Creators, T extends LOADER['type']>(type: T): Iterable<ObjectDefinition<LOADER>>;
    *list<T extends Creators['type']>(type?: T): Iterable<ObjectDefinition<Creators>> {
        function* iterateOverRegistry(map: Map<string, ObjectDefinition<Creators>>): Iterable<ObjectDefinition<Creators>> {
            for (const definition of map.values()) {
                yield definition;
            }
        }
        if (type) {
            yield* iterateOverRegistry(this.registries[type]);
        } else {
            for (const map of Object.values(this.registries)) {
                yield* iterateOverRegistry(map);
            }
        }
    }
}
