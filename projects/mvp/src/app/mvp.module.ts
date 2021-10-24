import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { MvpComponent } from './mvp.component';

@NgModule({
    declarations: [MvpComponent],
    imports: [BrowserModule, AppRoutingModule],
    providers: [],
    bootstrap: [MvpComponent],
})
export class MvpModule {}
