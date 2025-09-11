import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { ReportDynamicImportModalComponent } from './report-dynamic/report-dynamic-export-new/report-dynamic-import-modal/report-dynamic-import-modal.component';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  declarations: [
    ReportDynamicImportModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule
  ],
  entryComponents: [
    ReportDynamicImportModalComponent
  ]
})
export class ReportsModule { }