import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EngineModule } from '@yatd/engine';
import { YatdUiModule } from '@yatd/ui';

import { AppRoutingModule } from './app-routing.module';
import { ModelViewerComponent } from './model-viewer.component';
import { ViewerComponent } from './route/viewer/viewer.component';

@NgModule({
    declarations: [ModelViewerComponent, ViewerComponent],
    imports: [BrowserModule, AppRoutingModule, EngineModule, YatdUiModule],
    providers: [],
    bootstrap: [ModelViewerComponent]
})
export class ModelViewerModule {}
