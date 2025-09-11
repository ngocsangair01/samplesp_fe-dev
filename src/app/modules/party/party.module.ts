import { WorkProcessMemberComponent } from './party-member/work-process-member/work-process-member.component';
import { PartyMemberFormImportComponent } from './party-member/party-member-form-import/party-member-form-import.component';
import { PartyPositionFormComponent } from './party-position/party-position-form/party-position-form.component';
import { PartyMemberFormComponent } from './party-member/party-member-form/party-member-form.component';
import { PartyMemberSearchComponent } from './party-member/party-member-search/party-member-search.component';
import { PartyPositionSearchComponent } from './party-position/party-position-search/party-position-search.component';
import { PartyRoutingModule } from './party-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { PartyPositionIndexComponent } from './party-position/party-position-index/party-position-index.component';
import { PartyMemberIndexComponent } from './party-member/party-member-index/party-member-index.component';
import { TransferPartyMemberIndexComponent } from './transfer-party-member/transfer-party-member-index/transfer-party-member-index.component';
import { TransferPartyMemberSearchComponent } from './transfer-party-member/transfer-party-member-search/transfer-party-member-search.component';
import { TransferPartyMemberFormComponent } from './transfer-party-member/transfer-party-member-form/transfer-party-member-form.component';
import { TransferPartyMemberHistoryComponent } from './transfer-party-member/transfer-party-member-history/transfer-party-member-history.component';
import { RequestResolutionMonthSearchComponent } from './resolutions-month/request-resolutions-month/request-resolutions-month-search/request-resolutions-month-search.component';
import { RequestResolutionMonthFormComponent } from './resolutions-month/request-resolutions-month/request-resolutions-month-form/request-resolutions-month-form.component';
import { TransferPartyMemberConfirmComponent } from './transfer-party-member/transfer-party-member-confirm/transfer-party-member-confirm.component';
import { ResponseResolutionMonthIndexComponent } from './response-resolutions-month/response-resolution-month-index/response-resolution-month-index.component';
import { ResponseResolutionMonthSearchComponent } from './response-resolutions-month/response-resolution-month-search/response-resolution-month-search.component';
import { ResponseResolutionMonthFormComponent } from './response-resolutions-month/response-resolution-month-form/response-resolution-month-form.component';
import { RequestResolutionsMonthIndexComponent } from './resolutions-month/request-resolutions-month/request-resolutions-month-index/request-resolutions-month-index.component';
import { ResolutionQuarterYearIndexComponent } from './resolution-quarter-year/resolution-quarter-year-index/resolution-quarter-year-index.component';
import { ResolutionQuarterYearSearchComponent } from './resolution-quarter-year/resolution-quarter-year-search/resolution-quarter-year-search.component';
import { ResolutionQuarterYearFormComponent } from './resolution-quarter-year/resolution-quarter-year-form/resolution-quarter-year-form.component';
import { RequestResolutionMonthViewComponent } from './resolutions-month/request-resolutions-month/request-resolutions-month-view/request-resolutions-month-view.component';
import { RequestResolutionsMonthManage } from './resolutions-month/request-resolutions-month/request-resolutions-month-manage/request-resolutions-month-manage.component';
import {TreeTableModule} from 'primeng/treetable';
import { RequestTreeManageComponent } from './resolutions-month/request-tree-manage/request-tree-manage.component';
import { PopUpRejectComponent } from './resolutions-month/request-resolutions-month/pop-up-reject/pop-up-reject.component';
import { ResolutionQuarterYearCriteriaComponent } from './resolution-quarter-year/resolution-quarter-year-criteria/resolution-quarter-year-criteria.component';
import { CriteriaPlanTreeComponent } from './resolution-quarter-year/criteria-plan-tree/criteria-plan-tree.component';
import { ResolutionQuarterYearCriteriaSearchComponent } from './resolution-quarter-year/resolution-quarter-year-criteria-search/resolution-quarter-year-criteria-search.component';
import { ResolutionCriteriaHistoryComponent } from './resolution-quarter-year/resolution-criteria-history-pop-up/resolution-criteria-history.component';
import { ResolutionsQuarterYearManageComponent } from './resolution-quarter-year/resolutions-quarter-year-manage/resolutions-quarter-year-manage.component';
import { ResolutionsQuarterYearTreeManageComponent } from './resolution-quarter-year/resolutions-quarter-year-tree-manage/resolutions-quarter-year-tree-manage.component';
import { QualityAnalysisPartyOrganizationIndexComponent } from './quality-analysis-party-organization/quality-analysis-party-organization-index/quality-analysis-party-organization-index.component';
import { QualityAnalysisPartyOrganizationSearchComponent } from './quality-analysis-party-organization/quality-analysis-party-organization-search/quality-analysis-party-organization-search.component';
import { QualityAnalysisPartyOrganizationImportComponent } from './quality-analysis-party-organization/quality-analysis-party-organization-import/quality-analysis-party-organization-import.component';
import { QualityAnalysisPartyMemberIndexComponent } from './quality-analysis-party-member/quality-analysis-party-member-index/quality-analysis-party-member-index.component';
import { QualityAnalysisPartyMemberSearchComponent } from './quality-analysis-party-member/quality-analysis-party-member-search/quality-analysis-party-member-search.component';
import { QualityAnalysisPartyMemberImportComponent } from './quality-analysis-party-member/quality-analysis-party-member-import/quality-analysis-party-member-import.component';
import { QualityAnalysisPartyReportComponent } from './quality-analysis-party-report/quality-analysis-party-report.component';
import { RewardPartyOrganizationIndexComponent } from './reward-party/reward-party-organization/reward-party-organization-index/reward-party-organization-index.component';
import { RewardPartyOrganizationSearchComponent } from './reward-party/reward-party-organization/reward-party-organization-search/reward-party-organization-search.component';
import { RewardPartyOrganizationImportComponent } from './reward-party/reward-party-organization/reward-party-organization-import/reward-party-organization-import.component';
import { RewardPartyMemberIndexComponent } from './reward-party/reward-party-member/reward-party-member-index/reward-party-member-index.component';
import { RewardPartyMemberSearchComponent } from './reward-party/reward-party-member/reward-party-member-search/reward-party-member-search.component';
import { RewardPartyMemberImportComponent } from './reward-party/reward-party-member/reward-party-member-import/reward-party-member-import.component';
import { RewardPartyReportComponent } from './reward-party/reward-party-report/reward-party-report.component';
import { TransferPartyMemberAcceptComponent } from './transfer-party-member/transfer-party-member-accept/transfer-party-member-accept.component';
import { PartyMemberReportComponent } from './party-member/party-member-report/party-member-report.component';
import { QuestionAndAnswerIndexComponent } from './party-congress/question-and-answer/question-and-answer-index/question-and-answer-index.component';
import { QuestionAndAnswerSearchComponent } from './party-congress/question-and-answer/question-and-answer-search/question-and-answer-search.component';
import { QuestionAndAnswerFormComponent } from './party-congress/question-and-answer/question-and-answer-form/question-and-answer-form.component';
import { PartyCongressEmployeeIndexComponent } from './party-congress/party-congress-employee/party-congress-employee-index/party-congress-employee-index.component';
import { PartyCongressEmployeeSearchComponent } from './party-congress/party-congress-employee/party-congress-employee-search/party-congress-employee-search.component';
import { PartyCongressEmployeeImportComponent } from './party-congress/party-congress-employee/party-congress-employee-import/party-congress-employee-import.component';
import { PartyCongressEmployeeReportComponent } from './party-congress/party-congress-employee/party-congress-employee-report/party-congress-employee-report.component';
import { ImportPartyCriticizeComponent } from './party-criticize/import-party-criticize/import-party-criticize.component';
import { ReportPartyCriticizeComponent } from './party-criticize/report-party-criticize/report-party-criticize.component';
import { QualityAnalysisPartyMemberDetailComponent } from './quality-analysis-party-member/quality-analysis-party-member-detail/quality-analysis-party-member-detail.component';
import { QualityAnalysisPartyOrganizationViewComponent } from './quality-analysis-party-organization/quality-analysis-party-organization-view/quality-analysis-party-organization-view.component';
import { RewardPartyOrganizationViewComponent } from './reward-party/reward-party-organization/reward-party-organization-view/reward-party-organization-view.component';
import { RewardPartyMemberViewComponent } from './reward-party/reward-party-member/reward-party-member-view/reward-party-member-view.component';
import { PartyCriticizeIndexComponent } from './party-criticize/party-criticize-index/party-criticize-index.component';
import { PartyCriticizeSearchComponent } from './party-criticize/party-criticize-search/party-criticize-search.component';
import { PartyCriticizeFormComponent } from './party-criticize/party-criticize-form/party-criticize-form.component';
import { CommitteesReportComponent } from './party-member/committees-report/committees-report.component';
import { PartyCongressEmployeeFormComponent } from './party-congress/party-congress-employee/party-congress-employee-form/party-congress-employee-form.component';
import { PartyTransferReportComponent } from './party-member/party-transfer-report/party-transfer-report.component';
import { TransferPartyMemberConfirmCancelComponent } from './transfer-party-member/transfer-party-member-confirm-cancel/transfer-party-member-confirm-cancel.component';
import { PartyCongressEmployeeExcerptReportComponent } from './party-congress/party-congress-employee-excerpt-report/party-congress-employee-excerpt-report.component';
import { PartyMemberIndexCloneComponent } from './party-member-clone/party-member-index-clone/party-member-index-clone.component';
import { PartyMemberSearchCloneComponent } from './party-member-clone/party-member-search-clone/party-member-search-clone.component';
import { PartyMemberExclusionComponent } from './party-member-clone/party-member-exclusion/party-member-exclusion.component';
import { PartyMemberFormCloneComponent } from './party-member-clone/party-member-form-clone/party-member-form-clone.component';
import { PartyMemberFormImportCloneComponent } from './party-member-clone/party-member-form-import-clone/party-member-form-import-clone.component';
import { PartyMemberReportCloneComponent } from './party-member-clone/party-member-report-clone/party-member-report-clone.component';
import { PartyTransferReportCloneComponent } from './party-member-clone/party-transfer-report-clone/party-transfer-report-clone.component';
import { CommitteesReportCloneComponent } from './party-member-clone/committees-report-clone/committees-report-clone.component';
import { PartyMemberRemoveNameComponent } from './party-member-clone/party-member-remove-name/party-member-remove-name.component';
import { RequestResolutionMonthDetailComponent } from './resolutions-month/request-resolutions-month/request-resolutions-month-form/request-resolutions-month-detail/request-resolutions-month-detail';
import { ResponseResolutionMonthFormViewComponent } from './response-resolutions-month/response-resolution-month-form-view/response-resolution-month-form-view.component';
import { PartyHomeIndexComponent } from './party-home/party-home-index/party-home-index.component';
import { PartyHomeResulotionEmployeeComponent } from './party-home/party-home-resulotion-employee/party-home-resulotion-employee.component';
import { ResponseResolutionMonthListFileComponent } from './response-resolutions-month/response-resolution-month-list-file/response-resolution-month-list-file.component';
import { PartyMemberDecisionSignFileComponent } from './party-member-decision/party-member-decision-sign-file/party-member-decision-sign-file.component';
import { PartyMemberDecisionSearchComponent } from './party-member-decision/party-member-decision-search/party-member-decision-search.component';
import { PartyMemberDecisionFormComponent } from './party-member-decision/party-member-decision-form/party-member-decision-form.component';
import { PartyMemberDecisionIndexComponent } from './party-member-decision/party-member-decision-index/party-member-decision-index.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { EmpInfoComponent } from './party-member/layout/emp-info/emp-info.component';
import { LayoutComponent } from './party-member/layout/layout.component';
import { PersonalInformationFormComponent } from './party-member/personal-information/personal-information-form/personal-information-form.component';
import { EmployeeT63InfomationFormComponent } from './party-member/employee-t63-infomation/employee-t63-infomation-form/employee-t63-infomation-form.component';
import { EmployeeT63ExportFormComponent } from './party-member/employee-t63-infomation/employee-t63-export-form/employee-t63-export-form.component';
import { EmpTypeProcessIndexComponent } from './party-member/emp-type-process/emp-type-process-index/emp-type-process-index.component';
import { EmpTypeProcessSearchComponent } from './party-member/emp-type-process/emp-type-process-search/emp-type-process-search.component';
import { EmpTypeProcessFormComponent } from './party-member/emp-type-process/emp-type-process-form/emp-type-process-form.component';
import { PartyMemberConcurrentProcessIndexComponent } from './party-member/party-member-concurrent-process/party-member-concurrent-process-index/party-member-concurrent-process-index.component';
import { PartyMemberConcurrentProcessSearchComponent } from './party-member/party-member-concurrent-process/party-member-concurrent-process-search/party-member-concurrent-process-search.component';
import { PartyMemberConcurrentProcessFormComponent } from './party-member/party-member-concurrent-process/party-member-concurrent-process-form/party-member-concurrent-process-form.component';
import { QualityRatingPartyMemberComponent } from './party-member/quality-rating-party-member/quality-rating-party-member.component';
import { RewardPartyMemberComponent } from './party-member/reward-party-member/reward-party-member.component';
import { PunishmentComponent } from './party-member/punishment/punishment.component';
import { ProfileIndexComponent } from './party-member/profile/profile-index/profile-index.component';
import { ProfileSearchComponent } from './party-member/profile/profile-search/profile-search.component';
import { ProfileFormComponent } from './party-member/profile/profile-form/profile-form.component';
import { PartyMemberTotalComponent } from './party-home/party-home-report-tab/party-member-total/party-member-total.component';
import { PartyMemberNewComponent } from './party-home/party-home-report-tab/party-member-new/party-member-new.component';
import { PartyMemberDecreaseComponent } from './party-home/party-home-report-tab/party-member-decrease/party-member-decrease.component';
import { PartyMemberIncreaseComponent } from './party-home/party-home-report-tab/party-member-increase/party-member-increase.component';
import { PartyMemberVolatilityComponent } from './party-home/party-home-report-tab/party-member-volatility/party-member-volatility.component';
import { ChartModule } from 'primeng/chart';
import { PartyMemberAmountComponent } from './party-home/party-home-report-tab/party-member-amount/party-member-amount.component';
import { PartyMemberStructureComponent } from './party-home/party-home-report-tab/party-member-structure/party-member-structure.component';
import { PartyMemberContractComponent } from './party-home/party-home-report-tab/party-member-contract/party-member-contract.component';
import { PartyVolatilitySearchFormComponent } from './party-home/party-home-report-tab/party-member-volatility/party-volatility-search-form/party-volatility-search-form.component';
import { PartyCriteriaModalComponent } from './party-home/party-home-report-tab/party-member-contract/party-criteria-modal/party-criteria-modal.component';
// #211 Start
import { AssessmentPartyOrganizationIndexComponent } from './party-member/assessment-party-organization/assessment-party-organization-index/assessment-party-organization-index.component';
import { AssessmentPartyOrganizationSearchComponent } from './party-member/assessment-party-organization/assessment-party-organization-search/assessment-party-organization-search.component';
import { AssessmentPartyOrganizationImportComponent } from './party-member/assessment-party-organization/assessment-party-organization-import/assessment-party-organization-import.component';
import { AssessmentPartyOrganizationSumUpComponent } from './party-member/assessment-party-organization/assessment-party-organization-sum-up/assessment-party-organization-sum-up.component';
import { AssessmentPartyOrganizationDetailComponent } from './party-member/assessment-party-organization/assessment-party-organization-detail/assessment-party-organization-detail.component';
import { AssessmentPartyOrganizationSignFileComponent } from './party-member/assessment-party-organization/assessment-party-organization-sign-file/assessment-party-organization-sign-file.component';
import { AssessmentRequestAgainComponent } from './party-member/assessment-party-organization/assessment-request-again/assessment-request-again.component';
import { AssessmentSumaryIndexComponent } from './party-member/assessment-sumary/assessment-sumary-index.component';
import { AssessmentSumarySearchComponent } from './party-member/assessment-sumary/assessment-sumary-search/assessment-sumary-search.component';
import { AssessmentSumaryFormComponent } from './party-member/assessment-sumary/assessment-sumary-form/assessment-sumary-form.component';
import { AssessmentSumaryFormImportComponent } from './party-member/assessment-sumary/assessment-sumary-form-import/assessment-sumary-form-import.component';
import { AssessmentPartySignerIndexComponent } from './party-member/assessment-party-signer/assessment-party-signer-index/assessment-party-signer-index.component';
import { AssessmentPartySignerDetailComponent } from './party-member/assessment-party-signer/assessment-party-signer-detail/assessment-party-signer-detail.component';
import { AssessmentPartySignerImportComponent } from './party-member/assessment-party-signer/assessment-party-signer-import/assessment-party-signer-import.component';
import { AssessmentPartySignerSumUpComponent } from './party-member/assessment-party-signer/assessment-party-signer-sum-up/assessment-party-signer-sum-up.component';
import { AssessmentPartySignerSignFileComponent } from './party-member/assessment-party-signer/assessment-party-signer-sign-file/assessment-party-signer-sign-file.component';
import { AssessmentPartySignerSearchComponent } from './party-member/assessment-party-signer/assessment-party-signer-search/assessment-party-signer-search.component';
import { AssessmentSignerRequestAgainComponent } from './party-member/assessment-party-signer/assessment-signer-request-again/assessment-signer-request-again.component';
import { DashboardPartyComponent } from './dashboard-party/dashboard-party.component';
import { EducationProcessMemberIndexComponent } from './party-member/education-process-member/education-process-member-index/education-process-member-index.component';
import { EductionProcessMemberSearchComponent } from './party-member/education-process-member/education-process-member-search/education-process-member-search.component';
import {
  ThoroughResolutionMonthFormComponent
} from "@app/modules/party/response-resolutions-month/thorough-resolution-month-form/thorough-resolution-month-form.component";
import {
  ThoroughResolutionMonthSearchComponent
} from "@app/modules/party/response-resolutions-month/thorough-resolution-month-search/thorough-resolution-month-search.component";
import {
  ThoroughResolutionMonthContentComponent
} from "@app/modules/party/response-resolutions-month/thorough-resolution-month-content/thorough-resolution-month-content.component";
import {
  TransferPartyMemberWarningComponent
} from "@app/modules/party/transfer-party-member/transfer-party-member-warning/transfer-party-member-warning.component";
import { AdmissionManagementComponent } from './party-membership/admission-management/admission-management.component';
import { AdmissionProfileManagementComponent } from './party-membership/admission-profile-management/admission-profile-management.component';
import { AdmissionDecisionManagementComponent } from './party-membership/admission-decision-management/admission-decision-management.component';
import { AdmissionSympathyManagementComponent } from './party-membership/admission-sympathy-management/admission-sympathy-management.component';
import { AdmissionManagementAddComponent } from './party-membership/admission-management/admission-management-add/admission-management-add.component';
import { FileImportPartyManagementComponent } from './party-membership/file-import-party-management/file-import-party-management.component';

// #211 End

@NgModule({
  declarations: [
    PartyPositionSearchComponent,
    PartyMemberSearchComponent,
    PartyMemberFormComponent,
    PartyPositionFormComponent, 
    PartyMemberFormImportComponent, 
    PartyPositionIndexComponent,
    PartyMemberIndexComponent,
    TransferPartyMemberIndexComponent, 
    TransferPartyMemberSearchComponent,
    TransferPartyMemberWarningComponent,
    TransferPartyMemberFormComponent,
    TransferPartyMemberHistoryComponent,
    TransferPartyMemberConfirmComponent,
    RequestResolutionsMonthManage,
    PopUpRejectComponent,
    RequestResolutionMonthFormComponent,
    RequestResolutionMonthViewComponent,
    RequestTreeManageComponent,
    RequestResolutionMonthSearchComponent,
    RequestResolutionsMonthIndexComponent,
    ResponseResolutionMonthIndexComponent,
    ResponseResolutionMonthSearchComponent,
    ResponseResolutionMonthFormComponent,
    ResponseResolutionMonthFormViewComponent,
    ResolutionQuarterYearIndexComponent,
    ResolutionQuarterYearSearchComponent,
    ResolutionQuarterYearFormComponent,
    ResolutionQuarterYearCriteriaComponent,
    CriteriaPlanTreeComponent,
    ResolutionQuarterYearCriteriaSearchComponent,
    ResolutionCriteriaHistoryComponent,
    ResolutionsQuarterYearManageComponent,
    ResolutionsQuarterYearTreeManageComponent,
    QualityAnalysisPartyOrganizationIndexComponent,
    QualityAnalysisPartyOrganizationSearchComponent,
    QualityAnalysisPartyOrganizationImportComponent,
    QualityAnalysisPartyMemberIndexComponent,
    QualityAnalysisPartyMemberSearchComponent,
    QualityAnalysisPartyMemberImportComponent, 
    QualityAnalysisPartyReportComponent,
    TransferPartyMemberAcceptComponent,
    QualityAnalysisPartyMemberImportComponent,
    TransferPartyMemberAcceptComponent,
    RewardPartyOrganizationIndexComponent,
    RewardPartyOrganizationSearchComponent,
    RewardPartyOrganizationImportComponent,
    RewardPartyMemberIndexComponent,
    RewardPartyMemberSearchComponent,
    RewardPartyMemberImportComponent,
    RewardPartyReportComponent,
    PartyMemberReportComponent,
    QuestionAndAnswerIndexComponent,
    QuestionAndAnswerSearchComponent,
    QuestionAndAnswerFormComponent,
    PartyCongressEmployeeIndexComponent,
    PartyCongressEmployeeSearchComponent,
    PartyCongressEmployeeImportComponent,
    QuestionAndAnswerIndexComponent,
    PartyCongressEmployeeReportComponent,
    ImportPartyCriticizeComponent,
    ReportPartyCriticizeComponent,

    QualityAnalysisPartyMemberDetailComponent,
    QualityAnalysisPartyOrganizationViewComponent,
    RewardPartyOrganizationViewComponent,
    RewardPartyMemberViewComponent,
    ReportPartyCriticizeComponent,
    PartyCriticizeIndexComponent,
    PartyCriticizeSearchComponent,
    PartyCriticizeFormComponent,
    CommitteesReportComponent,
    PartyCongressEmployeeFormComponent,
    PartyTransferReportComponent,
    TransferPartyMemberConfirmCancelComponent,
    PartyCongressEmployeeExcerptReportComponent,

    PartyMemberIndexCloneComponent,
    PartyMemberSearchCloneComponent,
    PartyMemberExclusionComponent,
    PartyMemberFormCloneComponent,
    PartyMemberFormImportCloneComponent,
    PartyMemberReportCloneComponent,
    PartyTransferReportCloneComponent,
    CommitteesReportCloneComponent,
    PartyMemberRemoveNameComponent,
    
    // #203 start
    RequestResolutionMonthDetailComponent,
    PartyHomeIndexComponent,
    PartyHomeResulotionEmployeeComponent,

    ResponseResolutionMonthListFileComponent,
    // #203 end
    PartyMemberDecisionSearchComponent,
    PartyMemberDecisionFormComponent,
    PartyMemberDecisionIndexComponent,
    PartyMemberDecisionSignFileComponent,
    // d2t start tab thong tin Danb vien
    EmpInfoComponent,
    LayoutComponent,
    PersonalInformationFormComponent,
    EmployeeT63InfomationFormComponent,
    EmployeeT63ExportFormComponent,
    EmpTypeProcessIndexComponent,
    EmpTypeProcessSearchComponent,
    EmpTypeProcessFormComponent,
    PartyMemberConcurrentProcessIndexComponent,
    PartyMemberConcurrentProcessSearchComponent,
    PartyMemberConcurrentProcessFormComponent,
    QualityRatingPartyMemberComponent,
    RewardPartyMemberComponent,
    WorkProcessMemberComponent,
    PunishmentComponent,
    ProfileIndexComponent,
    ProfileSearchComponent,
    ProfileFormComponent,
    EducationProcessMemberIndexComponent,
    EductionProcessMemberSearchComponent,
    // d2t end
    // #202 start
    PartyMemberTotalComponent,
    PartyMemberNewComponent,
    PartyMemberDecreaseComponent,
    PartyMemberIncreaseComponent,
    PartyMemberVolatilityComponent,
    PartyMemberAmountComponent,
    PartyMemberStructureComponent,
    PartyMemberContractComponent,
    PartyVolatilitySearchFormComponent,
    PartyCriteriaModalComponent,
    // #202 end
    // #211 start
    AssessmentPartyOrganizationIndexComponent,
    AssessmentPartyOrganizationSearchComponent,
    AssessmentPartyOrganizationImportComponent,
    AssessmentPartyOrganizationSumUpComponent,
    AssessmentPartyOrganizationSignFileComponent,
    AssessmentPartyOrganizationDetailComponent,
    AssessmentRequestAgainComponent,
    AssessmentSumaryIndexComponent,
    AssessmentSumarySearchComponent,
    AssessmentSumaryFormComponent,
    AssessmentSumaryFormImportComponent,
    // #211 end
    AssessmentPartySignerIndexComponent,
    AssessmentPartySignerDetailComponent,
    AssessmentPartySignerImportComponent,
    AssessmentPartySignerSumUpComponent,
    AssessmentPartySignerSignFileComponent,
    AssessmentPartySignerSearchComponent,
    AssessmentSignerRequestAgainComponent,
    DashboardPartyComponent,
    ThoroughResolutionMonthFormComponent,
    ThoroughResolutionMonthSearchComponent,
    ThoroughResolutionMonthContentComponent,
    AdmissionManagementComponent, // quản lý đợt kết nạp Kết nạp đảng viên
    AdmissionProfileManagementComponent, // quản lý hồ sơ kết nạp
    AdmissionDecisionManagementComponent, // // quản lý quyết định kết nạp
    AdmissionSympathyManagementComponent, // quản lý danh sách học cảm tình đảng
    AdmissionManagementAddComponent, // thêm mới đợt kết nạp
    FileImportPartyManagementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PartyRoutingModule,
    TreeTableModule,
    AngularMultiSelectModule,
    // #202 start
    ChartModule,
    // #202 end
  ],
  entryComponents:[
    TransferPartyMemberHistoryComponent, 
    TransferPartyMemberConfirmComponent, 
    ResponseResolutionMonthFormComponent, 
    RequestResolutionsMonthManage, 
    ResolutionQuarterYearFormComponent,
    RequestResolutionsMonthManage, 
    PopUpRejectComponent,
    ResolutionCriteriaHistoryComponent,
    ResolutionsQuarterYearManageComponent,
    TransferPartyMemberAcceptComponent,

    QualityAnalysisPartyMemberDetailComponent,
    QualityAnalysisPartyOrganizationViewComponent,
    RewardPartyOrganizationViewComponent,
    RewardPartyMemberViewComponent,
    PartyCriticizeFormComponent,
    TransferPartyMemberConfirmCancelComponent,
    // #203 start
    ResponseResolutionMonthListFileComponent,
    // #203 end
    PartyMemberDecisionSignFileComponent,
    // d2t start 10/09/2021
    EmployeeT63ExportFormComponent,
    EmpTypeProcessFormComponent,
    ProfileFormComponent,
    PartyMemberConcurrentProcessFormComponent,
    // d2t end
    // #202 start
    PartyVolatilitySearchFormComponent,
    PartyCriteriaModalComponent,
    // #202 end
    // #211 start
    AssessmentPartyOrganizationImportComponent,
    AssessmentPartyOrganizationSignFileComponent,
    // #211 end
    // #229 start
    AssessmentRequestAgainComponent,
    // #229 end
    AssessmentPartySignerImportComponent,
    AssessmentPartySignerSignFileComponent,
    ThoroughResolutionMonthFormComponent,
    ThoroughResolutionMonthSearchComponent,
    ThoroughResolutionMonthContentComponent,
    AdmissionManagementComponent, // quản lý đợt kết nạp Kết nạp đảng viên
    FileImportPartyManagementComponent
  ],
})
export class PartyModule { }
