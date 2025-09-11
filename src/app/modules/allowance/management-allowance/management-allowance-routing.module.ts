import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllowanceFormComponent } from './allowance-form/allowance-form.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: ':id',
    component: AllowanceFormComponent
  },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementAllowanceRoutingModule { }