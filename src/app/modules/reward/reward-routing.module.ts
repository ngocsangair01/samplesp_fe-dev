
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RewardCategoryFormComponent } from './reward-category/reward-category-form/reward-category-form.component';
import { RewardCategoryIndexComponent } from './reward-category/reward-category-index/reward-category-index.component';
import { RewardGeneralFormComponent } from './reward-general-form/reward-general-form.component';
import { RewardGeneralIndexComponent } from './reward-general-index/reward-general-index.component';
import { RewardProposeApproveFormComponent } from './reward-propose-approve/reward-propose-approve-form/reward-propose-approve-form.component';
import { RewardProposeApproveIndexComponent } from './reward-propose-approve/reward-propose-approve-index/reward-propose-approve-index.component';
import { DecidedSignOutsideFormComponent } from './reward-propose-sign/decided-sign-outside-form/decided-sign-outside-form.component';
import { RewardProposeSignFormComponent } from './reward-propose-sign/reward-propose-sign-form/reward-propose-sign-form.component';
import { RewardProposeSignIndexComponent } from './reward-propose-sign/reward-propose-sign-index/reward-propose-sign-index.component';
import { RewardProposeFormComponent } from './reward-propose/reward-propose-form/reward-propose-form.component';
import { RewardProposeIndexComponent } from './reward-propose/reward-propose-index/reward-propose-index.component';
import { RewardEmbryoComponent } from './reward-category/reward-category-form/reward-embryo/reward-embryo.component';
import {
  RewardPaymentReportingComponent
} from "@app/modules/reward/reward-payment-reporting/reward-payment-reporting.component";
import {
  RewardReimbursementReportingDetailComponent
} from "@app/modules/reward/reward-payment-reporting/reward-reimbursement-reporting-detail/reward-reimbursement-reporting-detail.component";
import {
  RewardCategoryFundingIndexComponent
} from "@app/modules/reward/reward-category-funding/reward-category-funding-index/reward-category-funding-index.component";
import {
  RewardCategoryFundingFormComponent
} from "@app/modules/reward/reward-category-funding/reward-category-funding-form/reward-category-funding-form.component";
const routes: Routes = [
  {
    path: 'reward-general',
    component: RewardGeneralIndexComponent
  },
  {
    path: 'reward-propose',
    component: RewardProposeIndexComponent,
  },
  {
    path: 'reward-propose/add',
    component: RewardProposeFormComponent,
  },
  {
    path: 'reward-propose/edit/:id',
    component: RewardProposeFormComponent,
  },
  {
    path: 'reward-propose/view/:id',
    component: RewardProposeFormComponent,
  },
  {
    path: 'reward-propose/approve/:id',
    component: RewardProposeFormComponent,
  },
  {
    path: 'reward-propose-sign',
    component: RewardProposeSignIndexComponent,
  },
  {
    path: 'reward-propose-sign/add-sign',
    component: RewardProposeSignFormComponent,
  },
  {
    path: 'reward-propose-sign/edit-sign/:id',
    component: RewardProposeSignFormComponent,
  },
  {
    path: 'reward-propose-sign/view-sign/:id',
    component: RewardProposeSignFormComponent,
  },
  {
    path: 'reward-propose-approval',
    component: RewardProposeApproveIndexComponent,
  },
  {
    path: 'reward-propose-approval/edit-selection/:id',
    component: RewardProposeApproveFormComponent,
  },
  {
    path: 'reward-propose-approval/view-selection/:id',
    component: RewardProposeApproveFormComponent,
  },
  {
    path: 'reward-general/reward-group-add',
    component: RewardGeneralFormComponent
  },
  {
    path: 'reward-general/reward-personal-add',
    component: RewardGeneralFormComponent,
  },
  {
    path: 'reward-category',
    component: RewardCategoryIndexComponent,
  },
  {
    path: 'reward-embryo',
    component: RewardEmbryoComponent,
  },
  {
    path: 'reward-category/view/:id',
    component: RewardCategoryFormComponent,
  },
  {
    path: 'reward-category/add',
    component: RewardCategoryFormComponent,
  },
  {
    path: 'reward-category/edit/:id',
    component: RewardCategoryFormComponent,
  },
  {
    path: 'reward-general/reward-group-edit/:id',
    component: RewardGeneralFormComponent
  },
  {
    path: 'reward-general/reward-personal-edit/:id',
    component: RewardGeneralFormComponent,
  },
  {
    path: 'reward-propose-sign/decided-sign-outside/add-decided',
    component: DecidedSignOutsideFormComponent,
  },
  {
    path: 'reward-propose-sign/decided-sign-outside/edit-decision/:id',
    component: DecidedSignOutsideFormComponent,
  },
  {
    path: 'reward-propose-sign/decided-sign-outside/view-decision/:id',
    component: DecidedSignOutsideFormComponent,
  },
  {
    path: 'reward-payment-reporting',
    component: RewardPaymentReportingComponent,
  },
  {
    path: 'reward-payment-reporting/:id',
    component: RewardReimbursementReportingDetailComponent,
  },
  {
    path: 'reward-category-funding',
    component: RewardCategoryFundingIndexComponent,
  },
  {
    path: 'reward-category-funding/view/:id',
    component: RewardCategoryFundingFormComponent,
  },
  {
    path: 'reward-category-funding/add',
    component: RewardCategoryFundingFormComponent,
  },
  {
    path: 'reward-category-funding/edit/:id',
    component: RewardCategoryFundingFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardRoutingModule { }
