import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatReportSubmissionComponent } from './create-report/create-report.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: ':reportSubmissionId',
    component: CreatReportSubmissionComponent
  },
  {
    path: 'view/:reportSubmissionId',
    component: CreatReportSubmissionComponent
  },
  {
    path: 'view-manager/:reportSubmissionId',
    component: CreatReportSubmissionComponent
  },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportSubmissionRoutingModule { }