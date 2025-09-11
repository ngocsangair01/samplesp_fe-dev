import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubsidizedInfoApproveFormComponent } from './subsidized-info-approve/subsidized-info-approve-form/subsidized-info-approve-form.component';
import { SubsidizedInfoApproveIndexComponent } from './subsidized-info-approve/subsidized-info-approve-index/subsidized-info-approve-index.component';
import { SubsidizedInfoFormComponent } from './subsidized-info/subsidized-info-form/subsidized-info-form.component';
import { SubsidizedInfoIndexComponent } from './subsidized-info/subsidized-info-index/subsidized-info-index.component';
import { SubsidizedPeriodFormComponent } from './subsidized-period/subsidized-period-form/subsidized-period-form.component';
import { SubsidizedPeriodIndexComponent } from './subsidized-period/subsidized-period-index/subsidized-period-index.component';
import { SubsidizedResultIndexComponent } from './subsidized-result/subsidized-result-index/subsidized-result-index.component';

const routes: Routes = [
  // {
  //   path: 'subsidized-period',
  //   component: SubsidizedPeriodIndexComponent
  // },
  // {
  //   path: 'subsidized-period/add',
  //   component: SubsidizedPeriodFormComponent
  // },
  // {
  //   path: 'subsidized-period/edit/:id',
  //   component: SubsidizedPeriodFormComponent
  // },
  // {
  //   path: 'subsidized-period/view/:id',
  //   component: SubsidizedPeriodFormComponent,
  // },
  // {
  //   path: 'subsidized-suggest',
  //   component: SubsidizedInfoIndexComponent
  // },
  // {
  //   path: 'subsidized-suggest/add',
  //   component: SubsidizedInfoFormComponent
  // },
  // {
  //   path: 'subsidized-suggest/edit/:id',
  //   component: SubsidizedInfoFormComponent
  // },
  // {
  //   path: 'subsidized-suggest/view/:id',
  //   component: SubsidizedInfoFormComponent
  // },
  // {
  //   path: 'subsidized-approve',
  //   component: SubsidizedInfoApproveIndexComponent
  // },
  // {
  //   path: 'subsidized-approve/add',
  //   component: SubsidizedInfoApproveFormComponent
  // },
  // {
  //   path: 'subsidized-approve/edit/:id',
  //   component: SubsidizedInfoApproveFormComponent
  // },
  // {
  //   path: 'subsidized-approve/approve/:id',
  //   component: SubsidizedInfoApproveFormComponent
  // },
  // {
  //   path: 'subsidized-approve/view/:id',
  //   component: SubsidizedInfoApproveFormComponent
  // },
  // {
  //   path: 'subsidized-result',
  //   component: SubsidizedResultIndexComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubsidizedRoutingModule { }
