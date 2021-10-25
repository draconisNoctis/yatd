import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngineImplTestingComponent } from './engine-impl-testing.component';

const routes: Routes = [{ path: '', component: EngineImplTestingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EngineImplTestingRoutingModule { }
