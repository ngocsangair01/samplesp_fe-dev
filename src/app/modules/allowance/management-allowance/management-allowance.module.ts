import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { ManagementAllowanceRoutingModule } from './management-allowance-routing.module';
import { IndexComponent } from './index/index.component';
import { AllowanceFormComponent } from './allowance-form/allowance-form.component';
import { InportEmpAllowanceDialogComponent } from './inport-emp-allowance-dialog/inport-emp-allowance-dialog.component';

@NgModule({
  declarations: [
    IndexComponent,
    AllowanceFormComponent,
    InportEmpAllowanceDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManagementAllowanceRoutingModule
  ],
  entryComponents:[
    InportEmpAllowanceDialogComponent
  ]
})
export class ManagementAllowanceModule { }