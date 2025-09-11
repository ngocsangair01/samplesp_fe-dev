import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelfarePolicyCategoryComponent } from './welfare-policy-category-index/welfare-policy-category-index.component';
import { WelfarePolicyFormComponent } from './welfare-policy-category-form/welfare-policy-category-form.component';

const routes: Routes = [
  {
    path: '',
    component: WelfarePolicyCategoryComponent
  },
  {
    path: 'create',
    component: WelfarePolicyFormComponent
  },
  {
    path: 'update/:id',
    component: WelfarePolicyFormComponent
  },
  {
    path: 'view/:id',
    component: WelfarePolicyFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelfarePolicyCategoryRoutingModule { }
