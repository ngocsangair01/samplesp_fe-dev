import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { ClonePopupFormComponent } from './clone-popup/clone-popup-form.component';
import { CreateOrUpdateComponent } from './create-update/create-update.component';
import { CreateBusinessTypeComponent } from './dialog/create-business-type-dialog.component';
import { IndexComponent } from './index/index.component';
import { RequestReportRoutingModule } from './request-report-routing.module';

@NgModule({
  declarations: [
    CreateOrUpdateComponent,
    IndexComponent,
    CreateBusinessTypeComponent,
    ClonePopupFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RequestReportRoutingModule,
  ],
  entryComponents: [
    CreateBusinessTypeComponent,
    ClonePopupFormComponent,
]
})
export class RequestReportModule { }
