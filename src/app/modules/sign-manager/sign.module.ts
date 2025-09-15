import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../shared";
import {TableModule} from "primeng/table";
import {PaginatorModule} from "primeng/primeng";
import {DialogModule} from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { SignComponent } from './sign/sign.component';
import { SignRoutingModule } from './sign-routing.module';
import { SignIndexComponent } from './sign-index/sign-index.component';
import { MultipleSignComponent } from './multiple-sign/multiple-sign';
import { SignPreviewFileModalComponent } from './multiple-sign/preview-modal/sign-preview-file-modal.component';
import { ReportPreviewModalComponent } from './multiple-sign/preview-modal2/report-preview-modal.component';


@NgModule({
  declarations: [SignComponent, SignIndexComponent, MultipleSignComponent, SignPreviewFileModalComponent, ReportPreviewModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    DialogModule,
    SignRoutingModule,
    TableModule,
    PaginatorModule,AutoCompleteModule,
  ],
  entryComponents: [
    SignPreviewFileModalComponent,
    ReportPreviewModalComponent
],
})
export class SignModule {
}
