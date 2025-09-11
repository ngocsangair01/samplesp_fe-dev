import { InsuranceSalaryProcessListComponent } from './curriculum-vitae/view-all-personal-information/insurance-salary-process-list/insurance-salary-process-list.component';
import { EmpTypeProcessFormComponent } from './curriculum-vitae/emp-type-process/emp-type-process-form/emp-type-process-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { CurriculumVitaeSearchComponent } from './curriculum-vitae/curriculum-vitae-search/curriculum-vitae-search.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { LayoutComponent } from './curriculum-vitae/layout/layout.component';
import { PersonalInformationFormComponent } from './curriculum-vitae/personal-information/personal-information-form/personal-information-form.component';
import { EmpInfoComponent } from './curriculum-vitae/layout/emp-info/emp-info.component';
import { PartyStructureReportComponent } from './report/party-structure-report.component';
import { PartyExpiredReportComponent } from './report/party-expired-report.component';
import { EmpTypeProcessSearchComponent } from './curriculum-vitae/emp-type-process/emp-type-process-search/emp-type-process-search.component';
import { EmpFileSearchComponent } from './curriculum-vitae/emp-file/emp-file-search/emp-file-search.component';
import { EmpFileFormComponent } from './curriculum-vitae/emp-file/emp-file-form/emp-file-form.component';
import { EmployeeT63InfomationFormComponent } from './curriculum-vitae/employee-t63-infomation/employee-t63-infomation-form/employee-t63-infomation-form.component';
import { GroupOrgPositionReportComponent } from './report/group-org-position-report/group-org-position-report.component';
import { CurriculumVitaeIndexComponent } from './curriculum-vitae/curriculum-vitae-index/curriculum-vitae-index.component';
import { EmpFileIndexComponent } from './curriculum-vitae/emp-file/emp-file-index/emp-file-index.component';
import { EmpTypeProcessIndexComponent } from './curriculum-vitae/emp-type-process/emp-type-process-index/emp-type-process-index.component';
import { PartyMemberConcurrentProcessSearchComponent } from './curriculum-vitae/party-member-concurrent-process/party-member-concurrent-process-search/party-member-concurrent-process-search.component';
import { PartyMemberConcurrentProcessFormComponent } from './curriculum-vitae/party-member-concurrent-process/party-member-concurrent-process-form/party-member-concurrent-process-form.component';
import { PartyMemberConcurrentProcessIndexComponent } from './curriculum-vitae/party-member-concurrent-process/party-member-concurrent-process-index/party-member-concurrent-process-index.component';
import { ReligionReportComponent } from './report/religion-report/religion-report.component';
import { OfficerProfileSearchComponent } from './curriculum-vitae/officer-profile/officer-profile-search/officer-profile-search.component';
import { OfficerProfileIndexComponent } from './curriculum-vitae/officer-profile/officer-profile-index/officer-profile-index.component';
import { RetirementReportComponent } from './report/retirement-report/retirement-report.component';
import { EmployeeImportComponent } from './import/employee-import.component';
import { EmployeeReportComponent } from './report/employee-report/employee-report.component';
import { DeathGratuityReportComponent } from './report/death-gratuity-report/death-gratuity-report.component';
import { EmpTypePolicyReportComponent } from './report/emp-type-policy-report/emp-type-policy-report.component';
import { AssessmentIndexComponent } from './curriculum-vitae/assessment/assessment-index/assessment-index.component';
import { AssessmentSearchComponent } from './curriculum-vitae/assessment/assessment-index-search/assessment-search.component';
import { EmpFileImportFormComponent } from './curriculum-vitae/emp-file/emp-file-import-form/emp-file-import-form.component';
import { SendWarningEmpFileIndexComponent } from './send-warning-emp-file/send-warning-emp-file-index/send-warning-emp-file-index.component';
import { SendWarningEmpFileRequestComponent } from './send-warning-emp-file/send-warning-emp-file-request/send-warning-emp-file-request.component';
import { QualityRatingPartyMemberComponent } from './curriculum-vitae/quality-rating-party-member/quality-rating-party-member.component';
import { MemberJoinCongressComponent } from './curriculum-vitae/layout/member-join-congress/member-join-congress.component';
import { RewardPartyMemberComponent } from './curriculum-vitae/reward-party-member/reward-party-member.component';
import { EmployeeAssessmentReportComponent } from './report/employee-assessment-report/employee-assessment-report.component';
import { VicinityPositionPlanIndexComponent } from './vicinity-plan/vicinity-position-plan/vicinity-position-plan-index/vicinity-position-plan-index.component';
import { VicinityPositionPlanSearchComponent } from './vicinity-plan/vicinity-position-plan/vicinity-position-plan-search/vicinity-position-plan-search.component';
import { VicinityPositionPlanFormComponent } from './vicinity-plan/vicinity-position-plan/vicinity-position-plan-form/vicinity-position-plan-form.component';
import { VicinityEmployeePlanIndexComponent } from './vicinity-plan/vicinity-employee-plan/vicinity-employee-plan-index/vicinity-employee-plan-index.component';
import { VicinityEmployeePlanSearchComponent } from './vicinity-plan/vicinity-employee-plan/vicinity-employee-plan-search/vicinity-employee-plan-search.component';
import { VicinityEmployeePlanFormComponent } from './vicinity-plan/vicinity-employee-plan/vicinity-employee-plan-form/vicinity-employee-plan-form.component';
import { VicinityPositionPlanImportComponent } from './vicinity-plan/vicinity-position-plan/vicinity-position-plan-import/vicinity-position-plan-import.component';
import { VicinityEmployeePlanImportComponent } from './vicinity-plan/vicinity-employee-plan/vicinity-employee-plan-import/vicinity-employee-plan-import.component';
import { VicinityPlanReportComponent } from './vicinity-plan/vicinity-plan-report/vicinity-plan-report.component';
import { ServeArmyAgeReportComponent } from './report/serve-army-age-report/serve-army-age-report.component';
import { PersonalInformationViewComponent } from './curriculum-vitae/view-all-personal-information/personal-information-view/personal-information-view.component';
import { EmployeeT63InformationViewComponent } from './curriculum-vitae/view-all-personal-information/employee-t63-information-view/employee-t63-information-view.component';
import { ViewAllPersonalInfoIndex } from './curriculum-vitae/view-all-personal-information/view-all-personal-info-index/view-all-personal-info-index.component';
import { SalaryProcessListComponent } from './curriculum-vitae/view-all-personal-information/salary-process-list/salary-process-list.component';
import { EmpTypeProcessListComponent } from './curriculum-vitae/view-all-personal-information/emp-type-process-list/emp-type-process-list.component';
import { PartyMemberConcurrentProcessListComponent } from './curriculum-vitae/view-all-personal-information/party-member-concurrent-process-list/party-member-concurrent-process-list.component';
import { InsuranceProcessListComponent } from './curriculum-vitae/view-all-personal-information/insurance-process-list/insurance-process-list.component';
import { PartyMemberRewardListComponent } from './curriculum-vitae/view-all-personal-information/party-member-reward-list/party-member-reward-list.component';
import { EducationProcessListComponent } from './curriculum-vitae/view-all-personal-information/education-process-list/education-process-list.component';
import { FamilyRelationshipListComponent } from './curriculum-vitae/view-all-personal-information/family-relationship-list/family-relationship-list.component';
import { RelicFeaturedListComponent } from './curriculum-vitae/view-all-personal-information/relic-featured-list/relic-featured-list.component';
import { AssessmentListComponent } from './curriculum-vitae/view-all-personal-information/assessment-list/assessment-list.component';
import { EmployeeProfileListComponent } from './curriculum-vitae/view-all-personal-information/employee-profile-list/employee-profile-list.component';
import { IdeaInnoListComponent } from './curriculum-vitae/view-all-personal-information/idea-inno-list/idea-inno-list.component';
import { WorkProcessListComponent } from './curriculum-vitae/view-all-personal-information/work-process-list/work-process-list.component';
import { PartyExpiredDetailReportComponent } from './report/party-expired-detail-report/party-expired-detail-report.component';
import { DetailsOfManagersComponent } from './report/details-of-managers/details-of-managers.component';
import { WorkProcessMemberComponent } from './curriculum-vitae/work-process-member/work-process-member.component';
import { EmployeeT63ExportFormComponent } from './curriculum-vitae/employee-t63-infomation/employee-t63-export-form/employee-t63-export-form.component';
import { KeyProjectComponent } from './curriculum-vitae/view-all-personal-information/key-project/key-project.component';
import { PunishmentComponent } from './curriculum-vitae/view-all-personal-information/punishment/punishment.component';

import { VicinityPositionPlanSearchCloneComponent } from './vicinity-plan/vicinity-position-plan clone/vicinity-position-plan-search/vicinity-position-plan-search.component';
import { VicinityPositionPlanIndexCloneComponent } from './vicinity-plan/vicinity-position-plan clone/vicinity-position-plan-index/vicinity-position-plan-index.component';
import { VicinityPositionPlanImportCloneComponent } from './vicinity-plan/vicinity-position-plan clone/vicinity-position-plan-import/vicinity-position-plan-import.component';
import { VicinityPositionPlanFormCloneComponent } from './vicinity-plan/vicinity-position-plan clone/vicinity-position-plan-form/vicinity-position-plan-form.component';
import { VicinityPositionPlanDetailCloneComponent } from './vicinity-plan/vicinity-position-plan clone/vicinity-position-plan-detail/vicinity-position-plan-detail.component';
import { VicinityPositionPlanRotationCloneComponent } from './vicinity-plan/vicinity-position-plan clone/vicinity-position-plan-rotation/vicinity-position-plan-rotation.component';
import { PersonalInformationFormCloneComponent } from './curriculum-vitae/personal-information-clone/personal-information-form-clone/personal-information-form-clone.component';
import { EmpInfoCloneComponent } from './curriculum-vitae/layout-clone/emp-info-clone/emp-info-clone.component';
import { LayoutCloneComponent } from './curriculum-vitae/layout-clone/layout-clone.component';
import { StaffAssessmentCriteriaGroupIndexComponent } from './staff-assessment/staff-assessment-criteria-group/staff-assessment-criteria-group-index/staff-assessment-criteria-group-index.component';
import { StaffAssessmentCriteriaGroupSearchComponent } from './staff-assessment/staff-assessment-criteria-group/staff-assessment-criteria-group-search/staff-assessment-criteria-group-search.component';
import { StaffAssessmentCriteriaGroupFormComponent } from './staff-assessment/staff-assessment-criteria-group/staff-assessment-criteria-group-form/staff-assessment-criteria-group-form.component';
import { StaffAssessmentCriteriaIndexComponent } from './staff-assessment/staff-assessment-criteria/staff-assessment-criteria-index/staff-assessment-criteria-index.component';
import { StaffAssessmentCriteriaFormComponent } from './staff-assessment/staff-assessment-criteria/staff-assessment-criteria-form/staff-assessment-criteria-form.component';
import { StaffAssessmentCriteriaSearchComponent } from './staff-assessment/staff-assessment-criteria/staff-assessment-criteria-search/staff-assessment-criteria-search.component';
import { ListStaffAssessmentCriteriaComponent } from './staff-assessment/staff-assessment-criteria-group/list-staff-assessment-criteria/list-staff-assessment-criteria.component';
import { ChartModule } from 'primeng/primeng';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown'
import { EmployeeRetiredIndexComponent } from './employee-retired/employee-retired-index/employee-retired-index.component';
import { EmployeeRetiredSearchComponent } from './employee-retired/employee-retired-search/employee-retired-search.component';
import { RetiredInformationFormComponent } from './employee-retired/retired-information-form/retired-information-form.component';
import { LayoutEmployeeComponent } from './employee-retired/layout-emloyee/layout-emloyee.component';
import { RewardGeneralComponent } from './curriculum-vitae/reward-general/reward-general.component';
import { EmpInfoRetiredComponent } from './employee-retired/layout-emloyee/emp-info/emp-info.component';
import { OrganizationManagerSearchComponent } from './organization/organization-manager-search/organization-manager-search.component';
import { OrganizationManagerIndexComponent } from './organization/organization-manager-index/organization-manager-index.component';
import { ReportPreviewCertificateComponent } from '../employee/curriculum-vitae/reward-general/reward-general-preview/report-preview-certificate'
import {PreviewAsessmentModal2Component} from '../employee/curriculum-vitae/assessment/assessment-index-search/preview-assessment-modal/preview-assessment-modal.component';
import { PreviewAssessmentShowmoreComponent } from './curriculum-vitae/assessment/assessment-index-search/preview-assessment-showmore/preview-assessment-showmore.component';
import { DashboardEmployeeComponent } from './dashboard-employee/dashboard-employee.component';
import { PopulationProcessMemberComponent } from './curriculum-vitae/population-process-member/population-process-member.component';
import { PopulationProcessWomenComponent } from './curriculum-vitae/population-process-member/population-process-women/population-process-women.component';
import { PopulationProcessYoungComponent } from './curriculum-vitae/population-process-member/population-process-young/population-process-young.component';
import { PopulationProcessUnionComponent } from './curriculum-vitae/population-process-member/population-process-union/population-process-union.component';
import { PopulationMemberProcessFormComponent } from './curriculum-vitae/population-process-member/population-member-process-form/population-member-process-form.component';
import { EducationProcessMemberIndexComponent } from './curriculum-vitae/education-process-member/education-process-member-index/education-process-member-index.component';
import { EductionProcessMemberSearchComponent } from './curriculum-vitae/education-process-member/education-process-member-search/education-process-member-search.component';
import { AlowancePositionListComponent } from './curriculum-vitae/view-all-personal-information/alowance-position-list/alowance-position-list.component';
@NgModule({
  declarations: [
    CurriculumVitaeIndexComponent,
    CurriculumVitaeSearchComponent,
    LayoutComponent,
    EmpInfoComponent,
    PersonalInformationFormComponent, // Thông tin chung của CBNV
    EmployeeT63InfomationFormComponent, // Thông tin bổ sung T63
    PartyStructureReportComponent, // báo cáo cơ cấu cán bộ
    PartyExpiredReportComponent, // báo cáo niên hạn cán bộ
    EmpTypeProcessIndexComponent, //quá trình diện đối tượng
    EmpTypeProcessSearchComponent, //list quá trình diện đối tượng
    EmpTypeProcessFormComponent, // form quá trình diện đối tượng
    EmpFileIndexComponent, // hồ sơ
    EmpFileSearchComponent,  //list hồ sơ
    EmpFileFormComponent,  //form hồ sơ ]
    GroupOrgPositionReportComponent,  //Báo cáo nhóm chức danh theo đơn vị
    PartyMemberConcurrentProcessIndexComponent,  // Quá trình Đảng viên
    PartyMemberConcurrentProcessSearchComponent,  // List quá trình Đảng viên
    PartyMemberConcurrentProcessFormComponent,  // form quá trình Đảng viên
    ReligionReportComponent,
    OfficerProfileSearchComponent,
    OfficerProfileIndexComponent,
    RetirementReportComponent,
    EmployeeImportComponent,
    EmployeeReportComponent,
    DeathGratuityReportComponent,
    EmpTypePolicyReportComponent,
    AssessmentIndexComponent,
    AssessmentSearchComponent,
    EmpFileImportFormComponent,
    SendWarningEmpFileIndexComponent,
    SendWarningEmpFileRequestComponent,
    QualityRatingPartyMemberComponent,

    MemberJoinCongressComponent,
    RewardPartyMemberComponent,
    RewardGeneralComponent,
    EmployeeAssessmentReportComponent,
    VicinityPositionPlanIndexComponent,
    VicinityPositionPlanSearchComponent,
    VicinityPositionPlanFormComponent,
    VicinityPositionPlanImportComponent,
    VicinityEmployeePlanIndexComponent,
    VicinityEmployeePlanSearchComponent,
    VicinityEmployeePlanFormComponent,
    VicinityEmployeePlanImportComponent,
    VicinityPlanReportComponent,
    ServeArmyAgeReportComponent,
    ViewAllPersonalInfoIndex,
    PersonalInformationViewComponent,
    EmployeeT63InformationViewComponent,
    SalaryProcessListComponent,
    InsuranceSalaryProcessListComponent,
    EmpTypeProcessListComponent,
    PartyMemberConcurrentProcessListComponent,
    InsuranceProcessListComponent,
    InsuranceSalaryProcessListComponent,
    PartyMemberRewardListComponent,
    EducationProcessListComponent,
    FamilyRelationshipListComponent,
    RelicFeaturedListComponent,
    AssessmentListComponent,
    EmployeeProfileListComponent,
    RelicFeaturedListComponent,
    IdeaInnoListComponent,
    WorkProcessListComponent,
    PartyExpiredDetailReportComponent,
    DetailsOfManagersComponent,
    WorkProcessMemberComponent,
    EmployeeT63ExportFormComponent,
    KeyProjectComponent,
    PunishmentComponent,
    PopulationProcessMemberComponent,
    PopulationProcessWomenComponent,
    PopulationProcessYoungComponent,
    PopulationProcessUnionComponent,
    PopulationMemberProcessFormComponent,
    EducationProcessMemberIndexComponent,
    EductionProcessMemberSearchComponent,

    VicinityPositionPlanSearchCloneComponent,
    VicinityPositionPlanIndexCloneComponent,
    VicinityPositionPlanImportCloneComponent,
    VicinityPositionPlanFormCloneComponent,
    VicinityPositionPlanDetailCloneComponent,
    VicinityPositionPlanRotationCloneComponent,
    PersonalInformationFormCloneComponent,
    EmpInfoCloneComponent,
    LayoutCloneComponent,
    StaffAssessmentCriteriaGroupIndexComponent,
    StaffAssessmentCriteriaGroupSearchComponent,
    StaffAssessmentCriteriaGroupFormComponent,
    StaffAssessmentCriteriaIndexComponent,
    StaffAssessmentCriteriaSearchComponent,
    StaffAssessmentCriteriaFormComponent,
    ListStaffAssessmentCriteriaComponent,
    EmployeeRetiredIndexComponent,
    EmployeeRetiredSearchComponent,
    RetiredInformationFormComponent,
    LayoutEmployeeComponent,
    EmpInfoRetiredComponent,  
    ReportPreviewCertificateComponent,
    PreviewAsessmentModal2Component,
    PreviewAssessmentShowmoreComponent,
    DashboardEmployeeComponent,
    AlowancePositionListComponent // phụ cấp chức vụ
  ],
  imports: [
    CommonModule,
    SharedModule,
    EmployeeRoutingModule,
    ChartModule,
    AngularMultiSelectModule
  ],
  exports: [
  ],
  entryComponents: [
    EmpTypeProcessFormComponent,
    EmpFileFormComponent,
    PartyMemberConcurrentProcessFormComponent,
    EmpFileImportFormComponent,
    EmployeeT63ExportFormComponent,
    ReportPreviewCertificateComponent,
    PreviewAsessmentModal2Component,
    PreviewAssessmentShowmoreComponent,
    PopulationMemberProcessFormComponent,
    AlowancePositionListComponent // phụ cấp chức vụ
  ],
})
export class EmployeeModule {
}
