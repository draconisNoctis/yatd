import { InjectionToken, ValueProvider } from '@angular/core';
import { Creators, ObjectDefinition } from './object-registry.interfaces';

export const OBJECT_DEFINITIONS = new InjectionToken<ObjectDefinition<Creators>[]>('Object Definitions');

export function provideObjectDefinition(definition: ObjectDefinition<Creators>): ValueProvider {
    return {
        provide: OBJECT_DEFINITIONS,
        useValue: definition,
        multi: true
    };
}
