import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { YatdObjectsModule } from '@yatd/objects';
import { YatdUiModule } from '@yatd/ui';
import { ViewerRoutingModule } from './viewer-routing.module';
import { ViewerComponent } from './viewer.component';

@NgModule({
    declarations: [ViewerComponent],
    imports: [CommonModule, ViewerRoutingModule, YatdUiModule]
})
export class ViewerModule {}
