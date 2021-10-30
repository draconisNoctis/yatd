import { YatdObjectsModule } from '@yatd/objects';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EngineModule } from '@yatd/engine';
import { YatdUiModule } from '@yatd/ui';

import { AppRoutingModule } from './app-routing.module';
import { ModelViewerComponent } from './model-viewer.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { UiEffects } from './effects/ui.effects';

@NgModule({
    declarations: [ModelViewerComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        EngineModule,
        YatdUiModule,
        StoreModule.forRoot(reducers, { metaReducers }),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        EffectsModule.forRoot([UiEffects]),
        YatdObjectsModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [ModelViewerComponent]
})
export class ModelViewerModule {}
