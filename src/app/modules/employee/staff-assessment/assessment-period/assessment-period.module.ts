import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssessmentPeriodRoutingModule } from './assessment-period-routing.module';
import { AssessmentPeriodIndexComponent } from './assessment-period-index/assessment-period-index.component';
import { SharedModule } from '@app/shared';
import { AssessmentPeriodSearchComponent } from './assessment-period-search/assessment-period-search.component';
import { AssessmentPeriodFormComponent } from './assessment-period-form/assessment-period-form.component';
import { AssessmentCriteriaGroupMappingComponent } from './assessment-criteria-group-mapping/assessment-criteria-group-mapping.component';
import { AssessmentPeriodImportComponent } from './assessment-period-import/assessment-period-import.component';
import { ToastModule } from 'primeng/toast';
import { AssessmentEmployeeMappingComponent } from './assessment-employee-mapping/assessment-employee-mapping.component';
import { AssessmentPeriodStaffListComponent } from './assessment-period-staff-list/assessment-period-staff-list.component';
import { AssessmentPeriodImportForPartyOrganizationComponent } from './assessment-period-import-for-party-organization/assessment-period-import-for-party-organization.component';
import { AssessmentEmployeeFormComponent } from './assessment-employee-form/assessment-employee-form.component';
import { AssessmentPeriodDeleteByPartyOrganizationComponent } from './assessment-period-delete-by-party-organization/assessment-period-delete-by-party-organization.component';
import { AssessmentMemberFormComponent } from "@app/modules/employee/staff-assessment/assessment-period/assessment-member-form/assessment-member-form.component";
import { AssessmentPeriodNewImportComponent } from './assessment-period-import/assessment-period-new-import.component';
import {AssessmentPeriodModelComponent} from "@app/modules/employee/staff-assessment/assessment-period/assessment-member-form/assessment-member-model/assessment-period-model.component";
import {
  AssessmentPartyOrganizationNewImportComponent
} from "@app/modules/party/party-member/assessment-party-organization/assessment-party-organization-import/assessment-party-organization-new-import.component";
import { SignPreviewFileModalComponent } from './assessment-member-form/preview-modal/sign-preview-file-modal.component';
import { AssessmentPeriodCreatedList } from './assessment-period-created-list/assessment-period-created-list.component';
import { AssessmentMemberSignComponent } from './assessment-member-form/assessment-member-sign/assessment-member-sign.component';

@NgModule({
  declarations: [AssessmentPeriodIndexComponent
    , AssessmentPeriodSearchComponent
    , AssessmentPeriodFormComponent
    , AssessmentCriteriaGroupMappingComponent
    , AssessmentPeriodImportComponent
    , AssessmentEmployeeMappingComponent
    , AssessmentPeriodStaffListComponent
    , AssessmentPeriodImportForPartyOrganizationComponent
    , AssessmentEmployeeFormComponent
    , AssessmentPeriodDeleteByPartyOrganizationComponent
    , AssessmentMemberFormComponent
    , AssessmentPeriodNewImportComponent
    , AssessmentPartyOrganizationNewImportComponent
    , AssessmentPeriodModelComponent
    , SignPreviewFileModalComponent
    , AssessmentPeriodCreatedList
    , AssessmentMemberSignComponent
  ],
  imports: [
    CommonModule,
    AssessmentPeriodRoutingModule,
    SharedModule,
    ToastModule
  ],
  entryComponents: [AssessmentCriteriaGroupMappingComponent
    , AssessmentPeriodImportComponent
    , AssessmentEmployeeMappingComponent
    , AssessmentPeriodStaffListComponent
    , AssessmentPeriodImportForPartyOrganizationComponent
    , AssessmentEmployeeFormComponent
    , AssessmentPeriodDeleteByPartyOrganizationComponent
    , AssessmentPeriodNewImportComponent
    , AssessmentPartyOrganizationNewImportComponent
    , AssessmentPeriodModelComponent
    , SignPreviewFileModalComponent
    , AssessmentPeriodCreatedList
    , AssessmentMemberSignComponent
  ]
})
export class AssessmentPeriodModule { }
