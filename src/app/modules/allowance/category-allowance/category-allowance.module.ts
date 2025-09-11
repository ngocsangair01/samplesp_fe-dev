import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { CategoryAllowanceRoutingModule } from './category-allowance-routing.module';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { IndexComponent } from './index/index.component';

@NgModule({
  declarations: [
    IndexComponent,
    FormDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CategoryAllowanceRoutingModule
  ],
  entryComponents:[
    FormDialogComponent,
  ]
})
export class CategoryAllowanceModule { }