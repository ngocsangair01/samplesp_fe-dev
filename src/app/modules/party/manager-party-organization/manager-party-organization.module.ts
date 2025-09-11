import { ManagerPartyOrgViewComponent } from './manager-party-org-view/manager-party-org-view.component';
import { ManagerPartyOrgFormComponent } from './manager-party-org-form/manager-party-org-form.component';
import { ManagerPartyOrgSearchComponent } from './manager-party-org-search/manager-party-org-search.component';
import { ManagerPartyOrgIndexComponent } from './manager-party-org-index/manager-party-org-index.component';
import { ManagerPartyOrganizationComponent } from './manager-party-organization.component';
import { ManagerPartyOrganizationRoutingModule } from './manager-party-organization-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ManagerPartyOrgDeleteComponent } from './manager-party-org-delete/manager-party-org-delete.component';
import { ManagerPartyOrgTerminationComponent } from './manager-party-org-termination/manager-party-org-termination.component';
import { OrgTreeTerminateComponent } from './org-tree-terminate.component';
import { QualityRatingPartyOrganizationComponent } from '../quality-analysis-party-organization/quality-rating-party-organization/quality-rating-party-organization.component';

@NgModule({
  declarations: [
    ManagerPartyOrgIndexComponent,
    ManagerPartyOrgSearchComponent,
    ManagerPartyOrgFormComponent,
    ManagerPartyOrgViewComponent,
    ManagerPartyOrgDeleteComponent,
    ManagerPartyOrganizationComponent,
    ManagerPartyOrgTerminationComponent,
    OrgTreeTerminateComponent,
    QualityRatingPartyOrganizationComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AccordionModule,
    ManagerPartyOrganizationRoutingModule
  ], entryComponents: [ManagerPartyOrgDeleteComponent]
})
export class ManagerPartyOrganizationModule {}
