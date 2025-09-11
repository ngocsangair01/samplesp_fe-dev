import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/report',
    pathMatch: 'full'
  },
  {
    path: 'report-dynamic',
    loadChildren: './report-dynamic/report-dynamic.module#ReportDynamicModule'
  },
  {
    path: 'warning-manager',
    loadChildren: './warning-manager/warning.module#WarningModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }