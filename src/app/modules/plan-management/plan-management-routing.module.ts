
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/plan-management',
    pathMatch: 'full',
    children: []
  },
  {
    path: 'category',
    loadChildren: './category/plan-management-category.module#PlanManagementCategoryModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanManagementRoutingModule { }
