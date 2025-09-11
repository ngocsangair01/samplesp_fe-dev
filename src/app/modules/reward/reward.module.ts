import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { RewardGeneralIndexComponent } from './reward-general-index/reward-general-index.component';
import { RewardGeneralFormComponent } from './reward-general-form/reward-general-form.component';
import { RewardGeneralSelectComponent } from './reward-general-search/reward-general-search.component';
import { RewardRoutingModule } from './reward-routing.module';
import { RewardGeneralFormPositionComponent } from './reward-general-form/reward-general-form-position/reward-general-form-position.component';
import { RewardImportManageComponent } from './reward-general-form/file-import-management/reward-import-manage.component';
import { RewardProposeIndexComponent } from './reward-propose/reward-propose-index/reward-propose-index.component';
import { rewardProposeSearchComponent } from './reward-propose/reward-propose-search/reward-propose-search.component';
import { RewardProposeFormComponent } from './reward-propose/reward-propose-form/reward-propose-form.component';
import { RewardGroupPositionComponent } from './reward-propose/reward-propose-form/reward-group-position/reward-group-position.component';
import { RewardEmployeePositionComponent } from './reward-propose/reward-propose-form/reward-employee-position/reward-employee-position.component';
import { RewardOrganizationOutComponent } from './reward-propose/reward-propose-form/reward-organization-out/reward-organization-out.component';
import { RewardIndividualsOutComponent } from './reward-propose/reward-propose-form/reward-individuals-out/reward-individuals-out.component';
import { RewardSuggestImportManageComponent } from './reward-propose/reward-propose-form/file-import-reward-management/file-import-reward-management.component';
import { RewardSuggestImportManageComponent1 } from './reward-propose-approve/reward-propose-approve-form/file-import-reward-management/file-import-reward-management.component';
import { RewardDecideListComponent } from './reward-propose/reward-propose-form/reward-decide-list/reward-decide-list.component';
import { RewardDecideTableComponent } from './reward-propose/reward-propose-form/reward-decide-table/reward-decide-table.component';
import { RewardProposeSignIndexComponent } from './reward-propose-sign/reward-propose-sign-index/reward-propose-sign-index.component';
import { RewardProposeSignSearchComponent } from './reward-propose-sign/reward-propose-sign-search/reward-propose-sign-search.component';
import { RewardProposeSignFormComponent } from './reward-propose-sign/reward-propose-sign-form/reward-propose-sign-form.component';
import { RewardProposeApproveIndexComponent } from './reward-propose-approve/reward-propose-approve-index/reward-propose-approve-index.component';
import { RewardProposeApproveSearchComponent } from './reward-propose-approve/reward-propose-approve-search/reward-propose-approve-search.component';
import { RewardProposeApproveFormComponent } from './reward-propose-approve/reward-propose-approve-form/reward-propose-approve-form.component';
import { RewardCategorySearchComponent } from './reward-category/reward-category-search/reward-category-search.component';
import { RewardCategoryFormComponent } from './reward-category/reward-category-form/reward-category-form.component';
import { RewardCategoryIndexComponent } from './reward-category/reward-category-index/reward-category-index.component';
import { RewardProposeUnapproveComponent } from './reward-propose-approve/reward-propose-unapprove/reward-propose-unapprove.component';
import { RewardEmbryoComponent } from '../reward/reward-category/reward-category-form/reward-embryo/reward-embryo.component';
import { DecidedSignOutsideFormComponent } from './reward-propose-sign/decided-sign-outside-form/decided-sign-outside-form.component';
import { DecidedRewardEmployeePositionComponent } from './reward-propose-sign/decided-sign-outside-form/decision-reward-employee-position/decision-reward-employee-position.component';
import { DecisionRewardGroupPositionComponent } from './reward-propose-sign/decided-sign-outside-form/decision-reward-group-position/decision-reward-group-position.component';
import { DecisionRewardIndividualsOutComponent } from './reward-propose-sign/decided-sign-outside-form/decision-reward-individuals-out/decision-reward-individuals-out.component';
import { DecisionRewardOrganizationOutComponent } from './reward-propose-sign/decided-sign-outside-form/decision-reward-organization-out/decision-reward-organization-out.component';
import { FileImportDecisionRewardComponent } from './reward-propose-sign/decided-sign-outside-form/file-import-decision-reward/file-import-decision-reward.component';
import { ReportPreviewCertificateComponent } from './reward-general-preview/report-preview-certificate'
import { popupReasonCancel } from './reward-propose-approve/reward-propose-approve-search/reward-propose-reason-cancel/reward-propose-reason-cancel';
import { popupRejectReason } from './reward-propose-approve/reward-propose-approve-search/reward-propose-reject-reason/reward-propose-reject-reason';
import { AuthorityFormComponent } from './reward-propose-approve/reward-propose-approve-search/authority-form/authority-form.component'
import {
    RewardPaymentReportingComponent
} from "@app/modules/reward/reward-payment-reporting/reward-payment-reporting.component";
import {
    RewardReimbursementReportingDetailComponent
} from "@app/modules/reward/reward-payment-reporting/reward-reimbursement-reporting-detail/reward-reimbursement-reporting-detail.component";
import { RewardProcessLoadModalComponent } from './reward-propose/reward-process-load-modal/reward-process-load-modal.component';
import {
    RewardProposeSignErrorComponent
} from "@app/modules/reward/reward-propose-sign/reward-propose-sign-error/reward-propose-sign-error";
import { RewardCostComponent } from './reward-propose/reward-propose-form/reward-cost/reward-cost.component';
import { RewardCategoryFundingSearchComponent } from './reward-category-funding/reward-category-funding-search/reward-category-funding-search.component';
import {
    RewardCategoryFundingIndexComponent
} from "@app/modules/reward/reward-category-funding/reward-category-funding-index/reward-category-funding-index.component";
import {
    RewardCategoryFundingFormComponent
} from "@app/modules/reward/reward-category-funding/reward-category-funding-form/reward-category-funding-form.component";
import {
    DecidedRewardCostComponent
} from "@app/modules/reward/reward-propose-sign/decided-sign-outside-form/decided-reward-cost/decided-reward-cost.component";
import { SelectBudgetDateComponent } from './reward-propose-sign/select-budget-date/select-budget-date.component';
import { SelectBudgetDateAndFundCategoryComponent } from '@app/modules/reward/reward-propose-sign/select-budget-date-and-fun-category/select-budget-date-and-funcategory.component';
import {
    UpdateStatusRewardProposeSign
} from "@app/modules/reward/reward-propose-sign/update-status-reward-propose-sign/update-status-reward-propose-sign";
@NgModule({
    declarations: [
        RewardGeneralIndexComponent,
        RewardGeneralSelectComponent,
        RewardGeneralFormComponent,
        RewardGeneralFormPositionComponent,
        RewardImportManageComponent,
        RewardProposeIndexComponent,
        rewardProposeSearchComponent,
        RewardProposeFormComponent,
        RewardSuggestImportManageComponent,
        RewardSuggestImportManageComponent1,
        RewardGroupPositionComponent,
        RewardEmployeePositionComponent,
        RewardOrganizationOutComponent,
        RewardIndividualsOutComponent,
        RewardProposeSignIndexComponent,
        RewardProposeSignSearchComponent,
        RewardProposeSignFormComponent,
        RewardProposeApproveIndexComponent,
        RewardProposeApproveSearchComponent,
        RewardProposeApproveFormComponent,
        RewardCategorySearchComponent,
        RewardCategoryFormComponent,
        RewardCategoryIndexComponent,
        RewardCategoryFundingIndexComponent,
        RewardCategoryFundingFormComponent,
        RewardCategoryFundingSearchComponent,
        RewardProposeUnapproveComponent,
        RewardEmbryoComponent,
        RewardDecideListComponent,
        SelectBudgetDateComponent,
        SelectBudgetDateAndFundCategoryComponent,
        RewardDecideTableComponent,
        DecidedSignOutsideFormComponent,
        DecidedRewardEmployeePositionComponent,
        DecisionRewardGroupPositionComponent,
        DecisionRewardIndividualsOutComponent,
        DecisionRewardOrganizationOutComponent,
        FileImportDecisionRewardComponent,
        ReportPreviewCertificateComponent,
        popupReasonCancel,
        popupRejectReason,
        AuthorityFormComponent,
        RewardPaymentReportingComponent,
        RewardReimbursementReportingDetailComponent,
        RewardProcessLoadModalComponent,
        RewardProposeSignErrorComponent,
        RewardCostComponent,
        DecidedRewardCostComponent,
        RewardCategoryFundingSearchComponent,
        UpdateStatusRewardProposeSign
    ],
    imports: [
        CommonModule,
        SharedModule,
        RewardRoutingModule,
    ],
    exports: [
    ],
    entryComponents: [
        RewardImportManageComponent,
        RewardSuggestImportManageComponent,
        RewardSuggestImportManageComponent1,
        RewardProposeUnapproveComponent,
        RewardDecideListComponent,
        SelectBudgetDateComponent,
        SelectBudgetDateAndFundCategoryComponent,
        FileImportDecisionRewardComponent,
        ReportPreviewCertificateComponent,
        popupReasonCancel,
        popupRejectReason,
        AuthorityFormComponent,
        RewardProcessLoadModalComponent,
        RewardProposeSignErrorComponent,
        UpdateStatusRewardProposeSign
    ],
})
export class RewardModule {
}
