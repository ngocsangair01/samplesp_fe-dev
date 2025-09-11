import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemocraticMeetingIndexComponent } from './democratic-meeting/democratic-meeting-index/democratic-meeting-index.component';
import { RequestDemocraticMeetingIndexComponent } from './request-democratic-meeting/request-democratic-meeting-index/request-democratic-meeting-index.component';
import { RequestDemocraticMeetingFormComponent } from './request-democratic-meeting/request-democratic-meeting-form/request-democratic-meeting-form.component';
import { DemocraticMeetingFormComponent } from './democratic-meeting/democratic-meeting-form/democratic-meeting-form.component';
import { RequestDemocraticMeetingViewComponent } from './request-democratic-meeting/request-democratic-meeting-view/request-democratic-meeting-view.component';
import { OrgDemocraticMeetingReportComponent } from './democraticMeeting-report/org-democratic-meeting-report/org-democratic-meeting-report.component';
import {DashboardPopulationComponent} from "@app/modules/population/dashboard-population/dashboard-population.component";


export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPopulationComponent,
  },{
    path: 'democratic-meeting',
    component: DemocraticMeetingIndexComponent,  
  },{
    path: 'request-democratic-meeting',
    component: RequestDemocraticMeetingIndexComponent,  
  },{
    path: 'request-democratic-meeting-add',
    component: RequestDemocraticMeetingFormComponent,  
  },{
    path: 'request-democratic-meeting-edit/:id',
    component: RequestDemocraticMeetingFormComponent,
  },{
    path: 'democratic-meeting-add',
    component: DemocraticMeetingFormComponent,
  },{
    path: 'request-democratic-meeting-view/:id',
    component: RequestDemocraticMeetingViewComponent,
  },{
    path: 'democratic-meeting-edit/:id',
    component: DemocraticMeetingFormComponent,  
  },{
    path: 'democratic-meeting-view/:id/:view',
    component: DemocraticMeetingFormComponent,  
  },{
    path: 'org-democratic-meeting-report',
    component: OrgDemocraticMeetingReportComponent,  
  },
  {
    path: 'welfare-policy-category',
    loadChildren: './welfare-policy/welfare-policy-category/welfare-policy-category.module#WelfarePolicyCategoryModule'
  },
  {
    path: 'welfare-policy-request',
    loadChildren: './welfare-policy/welfare-policy-request/welfare-policy-request.module#WelfarePolicyRequestModule'
  },
  {
    path: 'welfare-policy-proposal',
    loadChildren: './welfare-policy/welfare-policy-proposal/welfare-policy-proposal.module#WelfarePolicyProposalModule'
  },
  {
    path: 'allowance-period',
    loadChildren: './allowance-period/allowance-period.module#AllowancePeriodModule'
  },
  {
    path: 'allowance-proposal',
    loadChildren: './allowance-proposal/allowance-proposal.module#AllowanceProposalModule'
  },
  {
    path: 'allowance-proposal-approval',
    loadChildren: './allowance-proposal-approval/allowance-proposal-approval.module#AllowanceProposalApprovalModule'
  },
  {
    path: 'emp-allowance-request',
    loadChildren: './emp-allowance-request/emp-allowance-request.module#EmpAllowanceRequestModule'
  },
  {
    path: 'allowance-proposal-sign',
    loadChildren: './allowance-proposal-sign/allowance-proposal-sign.module#AllowanceProposalSignModule'
  },
  {
    path: 'allowance-disease-category',
    loadChildren: './allowance-disease-category/allowance-disease-category.module#AllowanceDiseaseCategoryModule'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PopulationRoutingModule { }
