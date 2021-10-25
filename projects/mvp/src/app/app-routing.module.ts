import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'engine-impl-testing',
        loadChildren: () =>
            import('./engine-impl-testing/engine-impl-testing.module').then(
                (m) => m.EngineImplTestingModule
            ),
    },
    {
        path: '**',
        redirectTo: 'engine-impl-testing',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
