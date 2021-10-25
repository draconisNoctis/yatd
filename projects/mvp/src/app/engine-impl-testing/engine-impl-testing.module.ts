import { EngineModule } from '@yatd/engine';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EngineImplTestingRoutingModule } from './engine-impl-testing-routing.module';
import { EngineImplTestingComponent } from './engine-impl-testing.component';

@NgModule({
    declarations: [EngineImplTestingComponent],
    imports: [CommonModule, EngineImplTestingRoutingModule, EngineModule],
})
export class EngineImplTestingModule {}
