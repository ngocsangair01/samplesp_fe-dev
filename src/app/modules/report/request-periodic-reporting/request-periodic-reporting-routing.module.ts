import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IndexComponent} from "@app/modules/report/request-periodic-reporting/index/index.component";
import {
  DynamicReportComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/dynamic-report.component";

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'dynamic-report',
    component: DynamicReportComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestPeriodicReportingRoutingModule { }
