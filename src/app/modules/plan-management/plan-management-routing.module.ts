
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/plan-management',
    pathMatch: 'full',
  },
  {
    path:'plan-work-management',
    loadChildren: './plan-work-management/plan-work-management.module#PlanWorkManagementModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanManagementRoutingModule { }
