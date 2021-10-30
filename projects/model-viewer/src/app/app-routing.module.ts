import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'view', loadChildren: () => import('./route/viewer/viewer.module').then(m => m.ViewerModule) },
    { path: 'dashboard', loadChildren: () => import('./route/dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
