import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { CreateOrUpdateComponent } from './create-update/create-update.component';
import { IndexComponent } from './index/index.component';
import {ReportConfigRoutingModule} from "@app/modules/report/report-config/report-config-routing.module";


@NgModule({
  declarations: [CreateOrUpdateComponent, IndexComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReportConfigRoutingModule,
  ],
  entryComponents: []
})
export class ReportConfigModule { }
