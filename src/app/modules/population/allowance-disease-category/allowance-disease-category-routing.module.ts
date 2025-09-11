import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AllowanceDiseaseCategoryComponent
} from "@app/modules/population/allowance-disease-category/allowance-disease-category-index/allowance-disease-category-index.component";

const routes: Routes = [
  {
    path: '',
    component: AllowanceDiseaseCategoryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllowanceDiseaseCategoryRoutingModule { }
