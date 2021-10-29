import { Scene } from '@babylonjs/core';
import { MeshCreator, ObjectDefinition } from '@yatd/engine';

export const tower01: ObjectDefinition<MeshCreator> = {
    id: 'tower01',
    creator: {
        type: 'mesh',
        create: (scene: Scene) => import('./factory').then(f => f.create(scene))
    }
};
