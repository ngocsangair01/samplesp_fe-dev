import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { ExportComponent } from './export/export-dialog.component';
import { IndexComponent } from './index/index.component';
import { ReportPreviewModalComponent } from './preview-modal/report-preview-modal.component';
import { RejectFormComponent } from './reject-form/reject-form.component';
import { ReportManagerRoutingModule } from './report-manager-routing.module';
import { SendSMSComponent } from './send-sms/send-sms.component';
import { ReportManagerHistoryComponent } from "./report-manager-history/report-manager-history.component";
import { reportContentReview } from './index/report-content-review/report-content-review';
@NgModule({
  declarations: [IndexComponent, 
    ExportComponent, 
    SendSMSComponent, 
    RejectFormComponent, 
    ReportPreviewModalComponent,
    ReportManagerHistoryComponent,
    reportContentReview
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportManagerRoutingModule
  ],
  entryComponents: [
    ExportComponent,
    SendSMSComponent,
    RejectFormComponent,
    ReportPreviewModalComponent,
    ReportManagerHistoryComponent,
    reportContentReview
  ]
})
export class ReportManagerModule { }