import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { DemocraticMeetingSearchComponent } from './democratic-meeting/democratic-meeting-search/democratic-meeting-search.component';
import { DemocraticMeetingIndexComponent } from './democratic-meeting/democratic-meeting-index/democratic-meeting-index.component';
import { DemocraticMeetingFormComponent } from './democratic-meeting/democratic-meeting-form/democratic-meeting-form.component';
import { PopulationRoutingModule } from './population-routing.module';
import { RequestDemocraticMeetingIndexComponent } from './request-democratic-meeting/request-democratic-meeting-index/request-democratic-meeting-index.component';
import { RequestDemocraticMeetingFormComponent } from './request-democratic-meeting/request-democratic-meeting-form/request-democratic-meeting-form.component';
import { RequestDemocraticMeetingSearchComponent } from './request-democratic-meeting/request-democratic-meeting-search/request-democratic-meeting-search.component';
import { OrgTreeSelectorComponent } from './org-tree-selector/org-tree-selector.component';
import { RequestDemocraticMeetingViewComponent } from './request-democratic-meeting/request-democratic-meeting-view/request-democratic-meeting-view.component';
import { RequestDemocraticMeetingManageComponent } from './request-democratic-meeting-manage/request-democratic-meeting-manage.component';
import { RequestOrgTreeManageComponent } from './request-org-tree-manage/request-org-tree-manage.component';
import {TreeTableModule} from 'primeng/treetable';
import { OrgDemocraticMeetingReportComponent } from './democraticMeeting-report/org-democratic-meeting-report/org-democratic-meeting-report.component';
import { DashboardPopulationComponent } from './dashboard-population/dashboard-population.component';

@NgModule({
  declarations: [
    DemocraticMeetingFormComponent,
    DemocraticMeetingSearchComponent,
    DemocraticMeetingIndexComponent,
    RequestDemocraticMeetingIndexComponent,
    RequestDemocraticMeetingFormComponent,
    RequestDemocraticMeetingSearchComponent,
    OrgTreeSelectorComponent,
    RequestDemocraticMeetingViewComponent,
    RequestDemocraticMeetingManageComponent,
    RequestOrgTreeManageComponent,
    OrgDemocraticMeetingReportComponent,
    DashboardPopulationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PopulationRoutingModule,
    TreeTableModule
  ],
  entryComponents:[RequestDemocraticMeetingManageComponent,],
})
export class PopulationModule { }
