import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { CreatReportSubmissionComponent } from './create-report/create-report.component';
import { EmpSubmitComponent } from './emp-submit/emp-submit-dialog.component';
import { IndexComponent } from './index/index.component';
import { RejectFormComponent } from './reject-form/reject-form.component';
import { ReportSubmissionRoutingModule } from './report-submission-routing.module';
import { ReportSubmissionHistoryComponent } from './report-submission-history/report-submission-history.component';


@NgModule({
  declarations: [
    IndexComponent,
    CreatReportSubmissionComponent,
    EmpSubmitComponent,
    RejectFormComponent,
    ReportSubmissionHistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportSubmissionRoutingModule,
    
  ],
  entryComponents: [
    EmpSubmitComponent,
    RejectFormComponent,
    ReportSubmissionHistoryComponent
  ]
})
export class ReportSubmissionModule { }