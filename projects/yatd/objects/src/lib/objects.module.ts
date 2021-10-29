import { tower01 } from './objects/tower01';
import { axis_indicator } from './objects/axis_indicator';
import { NgModule } from '@angular/core';
import { provideObjectDefinition } from '@yatd/engine';

@NgModule({
    providers: [provideObjectDefinition(tower01), provideObjectDefinition(axis_indicator)]
})
export class YatdObjectsModule {}
