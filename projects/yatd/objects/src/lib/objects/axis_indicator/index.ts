import { Scene } from '@babylonjs/core';
import { ObjectDefinition, TransformNodeCreator } from '@yatd/engine';

export const axis_indicator: ObjectDefinition<TransformNodeCreator> = {
    id: 'axis_indicator',
    creator: {
        type: 'transformNode',
        create: (scene: Scene) => import('./factory').then(f => f.create(scene))
    },
    dimensions: {
        height: 5,
        width: 5,
        depth: 5
    }
};
