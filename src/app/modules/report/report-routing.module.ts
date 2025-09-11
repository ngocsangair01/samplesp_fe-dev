import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full'
  },
  {
    path: 'request-report',
    loadChildren: './request-report/request-report.module#RequestReportModule'
  },
  {
    path: 'report-submission',
    loadChildren: './report-submission/report-submission.module#ReportSubmissionModule'
  },
  {
    path: 'report-manager',
    loadChildren: './report-manager/report-manager.module#ReportManagerModule'
  },
  {
    path: 'report-config',
    loadChildren: './report-config/report-config.module#ReportConfigModule'
  },
  {
    path: 'request-periodic-reporting',
    loadChildren: './request-periodic-reporting/request-periodic-reporting.module#RequestPeriodicReportingModule'
  },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
