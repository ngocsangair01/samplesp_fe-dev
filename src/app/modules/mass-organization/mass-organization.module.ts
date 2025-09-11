import { MassOrgTreeComponent } from './../../shared/components/mass-org-tree/mass-org-tree.component';
import { MassOrganizationComponent } from './mass-organization.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreeTableModule} from 'primeng/treetable';
import { MassOrganizationRoutingModule } from './mass-organization-routing.module';
import { SharedModule } from '@app/shared';
import { MassOrganizationIndexComponent } from './mass-organization-index/mass-organization-index.component';
import { MassOrganizationAddComponent } from './mass-organization-add/mass-organization-add.component';
import { MassOrganizationSearchComponent } from './mass-organization-search/mass-organization-search.component';
import { MassPositionIndexComponent } from './mass-position/mass-position-index/mass-position-index.component';
import { MassPositionSearchComponent } from './mass-position/mass-position-search/mass-position-search.component';
import { ManagementEmployeeSearchComponent } from './management-employee-search/management-employee-search.component';
import { MassPositionAddComponent } from './mass-position/mass-position-add/mass-position-add.component';
import { MassOrganizationImportComponent } from './mass-organization-import/mass-organization-import.component';
import { ManagementEmployeeAddComponent } from './management-employee-add/management-employee-add.component';
import { MassRequestIndexComponent } from './mass-request-index/mass-request-index.component';
import { MassRequestSearchComponent } from './mass-request-search/mass-request-search.component';
import { MassRequestFormComponent } from './mass-request-form/mass-request-form.component';
import { MassRequestCriteriaPlanComponent } from './mass-request-criteria-plan/mass-request-criteria-plan.component';
import { MassCriteriaTreeComponent } from './mass-criteria-tree/mass-criteria-tree.component';
import { MassOrgTreeSelectorComponent } from './mass-org-tree-selector/mass-org-tree-selector.component';
import { ManagementEmployeeImportComponent } from './management-employee-import/management-employee-import.component';
import { ManagementEmployeeIndexComponent } from './management-employee-index/management-employee-index.component';
import { MassCriteriaResponseIndexComponent } from './mass-criteria-response/mass-criteria-response-index/mass-criteria-response-index.component';
import { MassCriteriaResponseSearchComponent } from './mass-criteria-response/mass-criteria-response-search/mass-criteria-response-search.component';
import { MassCriteriaResponseFormComponent } from './mass-criteria-response/mass-criteria-response-form/mass-criteria-response-form.component';
import { MassRequestManageComponent } from './mass-request-manage/mass-request-manage.component';
import { MassRequestTreeManageComponent } from './mass-request-manage/mass-request-tree-manage/mass-request-tree-manage.component';
import { MassRequestViewComponent } from './mass-request-view/mass-request-view.component';
import { MassCriteriaResponseViewComponent } from './mass-request-view/mass-criteria-response-view/mass-criteria-response-view.component';
import { ManagementEmployeeAddPositionComponent } from './management-employee-add/form-children/management-employee-add-position.component';
import { SignVofficeHistoryComponent } from "./mass-criteria-response/mass-criteria-response-search/sign-voffice-history/sign-voffice-history.component";
import { DashboardMassComponent } from './dashboard-mass/dashboard-mass.component';

@NgModule({
  declarations: [
    MassOrganizationSearchComponent,
    MassPositionIndexComponent,
    MassPositionSearchComponent,
    MassPositionAddComponent,
    MassOrganizationSearchComponent,
    MassOrganizationIndexComponent,
    MassOrganizationAddComponent,
    MassOrganizationComponent,
    MassOrgTreeComponent,
    ManagementEmployeeSearchComponent,
    MassOrganizationImportComponent,
    ManagementEmployeeAddComponent,
    MassRequestIndexComponent,
    MassRequestSearchComponent,
    MassRequestFormComponent,
    MassRequestCriteriaPlanComponent,
    MassCriteriaTreeComponent,
    MassOrgTreeSelectorComponent,
    ManagementEmployeeImportComponent,
    ManagementEmployeeIndexComponent,
    MassCriteriaResponseIndexComponent,
    MassCriteriaResponseSearchComponent,
    MassCriteriaResponseFormComponent,
    MassRequestManageComponent,
    MassRequestTreeManageComponent,
    MassRequestViewComponent,
    MassCriteriaResponseViewComponent,
    ManagementEmployeeAddPositionComponent,
    SignVofficeHistoryComponent,
    DashboardMassComponent
  ],
  imports: [
    CommonModule,SharedModule,
    MassOrganizationRoutingModule,
    TreeTableModule
  ],
  entryComponents: [MassRequestFormComponent,
                    MassRequestManageComponent,
                    MassCriteriaResponseViewComponent,
                    SignVofficeHistoryComponent
                  ]
})
export class MassOrganizationModule { }
  