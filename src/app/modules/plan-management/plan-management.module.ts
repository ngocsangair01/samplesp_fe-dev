import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanManagementRoutingModule } from './plan-management-routing.module';
import { SharedModule } from '@app/shared';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    PlanManagementRoutingModule,
  ],
  entryComponents: [
  ],
})
export class PlanManagementModule { }
