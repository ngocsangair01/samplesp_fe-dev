
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundActivityFormComponent } from './fund-activity/fund-activity-form/fund-activity-form.component';
import { FundActivityComponent } from './fund-activity/fund-activity-index.component';
import { FundManagementFormComponent } from './fund-management/fund-management-form/fund-management-form.component';
import { FundManagementComponent } from './fund-management/fund-management-index.component';
import { FundContributionComponent } from './fund-contribution/fund-contribution-index.component';
import { FundContributionFormComponent } from './fund-contribution/fund-contribution-form/fund-contribution-form.component';
import { FundHistoryIndexComponent } from './fund-management/fund-history/fund-history-index.component';

const routes: Routes = [
  {
    path: 'fund-management',
    component: FundManagementComponent,
  },
  {
    path: 'fund-management/fund-management-add',
    component: FundManagementFormComponent,
  },
  {
    path: 'fund-management/fund-management-view/:id/:view',
    component: FundManagementFormComponent,
  },
  {
    path: 'fund-management/fund-management-edit/:id',
    component: FundManagementFormComponent,
  },
  //fund contribution
  {
    path: 'fund-contribution',
    component: FundContributionComponent,
  },
  {
    path: 'fund-contribution/fund-contribution-add',
    component: FundContributionFormComponent,
  },
  {
    path: 'fund-contribution/fund-contribution-view/:id/:view',
    component: FundContributionFormComponent,
  },
  {
    path: 'fund-contribution/fund-contribution-edit/:id',
    component: FundContributionFormComponent,
  },
  {
    path: 'fund-activity',
    component: FundActivityComponent,
  },
  {
    path: 'fund-activity/fund-activity-add',
    component: FundActivityFormComponent,
  },
  {
    path: 'fund-activity/fund-activity-view/:id/:view',
    component: FundActivityFormComponent,
  },
  {
    path: 'fund-activity/fund-activity-edit/:id',
    component: FundActivityFormComponent,
  },
  {
    path: 'fund-management/fund-history/:id',
    component: FundHistoryIndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundRoutingModule { }
