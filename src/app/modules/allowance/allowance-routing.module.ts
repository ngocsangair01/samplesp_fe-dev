import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full'
  },
  {
    path: 'category',
    loadChildren: './category-allowance/category-allowance.module#CategoryAllowanceModule'
  },
  {
    path: 'management',
    loadChildren: './management-allowance/management-allowance.module#ManagementAllowanceModule'
  },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllowanceRoutingModule { }