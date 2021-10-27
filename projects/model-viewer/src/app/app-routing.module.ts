import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerComponent } from './route/viewer/viewer.component';

const routes: Routes = [
    {
        path: 'view/:model',
        component: ViewerComponent
    },
    { path: '**', redirectTo: 'view/test' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
