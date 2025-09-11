import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import {
  AllowanceDiseaseCategoryComponent,
} from '@app/modules/population/allowance-disease-category/allowance-disease-category-index/allowance-disease-category-index.component';
import { AllowanceDiseaseCategoryRoutingModule } from './allowance-disease-category-routing.module';



@NgModule({
  declarations: [AllowanceDiseaseCategoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    AllowanceDiseaseCategoryRoutingModule
  ],
  entryComponents: []
})
export class AllowanceDiseaseCategoryModule { }
