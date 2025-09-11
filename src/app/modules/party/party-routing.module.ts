import {WorkProcessMemberComponent} from './party-member/work-process-member/work-process-member.component';
import {EmployeeT63InfomationFormComponent} from './party-member/employee-t63-infomation/employee-t63-infomation-form/employee-t63-infomation-form.component';
import {EmpTypeProcessIndexComponent} from './party-member/emp-type-process/emp-type-process-index/emp-type-process-index.component';
import {PersonalInformationFormComponent} from './party-member/personal-information/personal-information-form/personal-information-form.component';
import {LayoutComponent} from './party-member/layout/layout.component';
import {PartyTransferReportComponent} from './party-member/party-transfer-report/party-transfer-report.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PartyMemberFormImportComponent} from './party-member/party-member-form-import/party-member-form-import.component';
import {PartyPositionFormComponent} from './party-position/party-position-form/party-position-form.component';
import {PartyMemberFormComponent} from './party-member/party-member-form/party-member-form.component';
import {PartyPositionIndexComponent} from './party-position/party-position-index/party-position-index.component';
import {PartyMemberIndexComponent} from './party-member/party-member-index/party-member-index.component';
import {TransferPartyMemberIndexComponent} from './transfer-party-member/transfer-party-member-index/transfer-party-member-index.component';
import {TransferPartyMemberFormComponent} from './transfer-party-member/transfer-party-member-form/transfer-party-member-form.component';
import {RequestResolutionMonthFormComponent} from './resolutions-month/request-resolutions-month/request-resolutions-month-form/request-resolutions-month-form.component';
import {ResponseResolutionMonthIndexComponent} from './response-resolutions-month/response-resolution-month-index/response-resolution-month-index.component';
import {ResponseResolutionMonthFormComponent} from './response-resolutions-month/response-resolution-month-form/response-resolution-month-form.component';
import {RequestResolutionsMonthIndexComponent} from './resolutions-month/request-resolutions-month/request-resolutions-month-index/request-resolutions-month-index.component';
import {ResolutionQuarterYearIndexComponent} from './resolution-quarter-year/resolution-quarter-year-index/resolution-quarter-year-index.component';
import {RequestResolutionMonthViewComponent} from './resolutions-month/request-resolutions-month/request-resolutions-month-view/request-resolutions-month-view.component';
import {ResolutionQuarterYearCriteriaComponent} from './resolution-quarter-year/resolution-quarter-year-criteria/resolution-quarter-year-criteria.component';
import {ResolutionQuarterYearCriteriaSearchComponent} from './resolution-quarter-year/resolution-quarter-year-criteria-search/resolution-quarter-year-criteria-search.component';
import {QualityAnalysisPartyOrganizationIndexComponent} from './quality-analysis-party-organization/quality-analysis-party-organization-index/quality-analysis-party-organization-index.component';
import {QualityAnalysisPartyOrganizationImportComponent} from './quality-analysis-party-organization/quality-analysis-party-organization-import/quality-analysis-party-organization-import.component';
import {QualityAnalysisPartyMemberIndexComponent} from './quality-analysis-party-member/quality-analysis-party-member-index/quality-analysis-party-member-index.component';
import {QualityAnalysisPartyMemberImportComponent} from './quality-analysis-party-member/quality-analysis-party-member-import/quality-analysis-party-member-import.component';
import {QualityAnalysisPartyReportComponent} from './quality-analysis-party-report/quality-analysis-party-report.component';
import {RewardPartyOrganizationIndexComponent} from './reward-party/reward-party-organization/reward-party-organization-index/reward-party-organization-index.component';
import {RewardPartyOrganizationImportComponent} from './reward-party/reward-party-organization/reward-party-organization-import/reward-party-organization-import.component';
import {RewardPartyMemberIndexComponent} from './reward-party/reward-party-member/reward-party-member-index/reward-party-member-index.component';
import {RewardPartyMemberImportComponent} from './reward-party/reward-party-member/reward-party-member-import/reward-party-member-import.component';
import {RewardPartyReportComponent} from './reward-party/reward-party-report/reward-party-report.component';
import {PartyMemberReportComponent} from './party-member/party-member-report/party-member-report.component';
import {QuestionAndAnswerIndexComponent} from './party-congress/question-and-answer/question-and-answer-index/question-and-answer-index.component';
import {QuestionAndAnswerFormComponent} from './party-congress/question-and-answer/question-and-answer-form/question-and-answer-form.component';
import {PartyCongressEmployeeIndexComponent} from './party-congress/party-congress-employee/party-congress-employee-index/party-congress-employee-index.component';
import {PartyCongressEmployeeImportComponent} from './party-congress/party-congress-employee/party-congress-employee-import/party-congress-employee-import.component';
import {PartyCongressEmployeeReportComponent} from './party-congress/party-congress-employee/party-congress-employee-report/party-congress-employee-report.component';
import {PartyCriticizeIndexComponent} from './party-criticize/party-criticize-index/party-criticize-index.component';
import {ReportPartyCriticizeComponent} from './party-criticize/report-party-criticize/report-party-criticize.component';
import {ImportPartyCriticizeComponent} from './party-criticize/import-party-criticize/import-party-criticize.component';
import {CommitteesReportComponent} from './party-member/committees-report/committees-report.component';
import {PartyCongressEmployeeFormComponent} from './party-congress/party-congress-employee/party-congress-employee-form/party-congress-employee-form.component';
import {PartyCongressEmployeeExcerptReportComponent} from './party-congress/party-congress-employee-excerpt-report/party-congress-employee-excerpt-report.component';
import {PartyMemberIndexCloneComponent} from './party-member-clone/party-member-index-clone/party-member-index-clone.component';
import {PartyMemberExclusionComponent} from './party-member-clone/party-member-exclusion/party-member-exclusion.component'
import {PartyMemberFormImportCloneComponent} from './party-member-clone/party-member-form-import-clone/party-member-form-import-clone.component';
import {PartyMemberFormCloneComponent} from './party-member-clone/party-member-form-clone/party-member-form-clone.component';
import {PartyMemberRemoveNameComponent} from './party-member-clone/party-member-remove-name/party-member-remove-name.component';
import {ResponseResolutionMonthFormViewComponent} from './response-resolutions-month/response-resolution-month-form-view/response-resolution-month-form-view.component';
import {PartyHomeIndexComponent} from './party-home/party-home-index/party-home-index.component';
import {PartyMemberDecisionIndexComponent} from './party-member-decision/party-member-decision-index/party-member-decision-index.component';
import {PartyMemberDecisionFormComponent} from './party-member-decision/party-member-decision-form/party-member-decision-form.component';
import {PartyMemberConcurrentProcessIndexComponent} from './party-member/party-member-concurrent-process/party-member-concurrent-process-index/party-member-concurrent-process-index.component';
import {QualityRatingPartyMemberComponent} from './party-member/quality-rating-party-member/quality-rating-party-member.component';
import {RewardPartyMemberComponent} from './party-member/reward-party-member/reward-party-member.component';
import {PunishmentComponent} from './party-member/punishment/punishment.component';
import {ProfileIndexComponent} from './party-member/profile/profile-index/profile-index.component';
import {AssessmentPartyOrganizationIndexComponent} from './party-member/assessment-party-organization/assessment-party-organization-index/assessment-party-organization-index.component';
import {AssessmentPartyOrganizationSumUpComponent} from './party-member/assessment-party-organization/assessment-party-organization-sum-up/assessment-party-organization-sum-up.component';
import {AssessmentPartyOrganizationDetailComponent} from './party-member/assessment-party-organization/assessment-party-organization-detail/assessment-party-organization-detail.component';
import {AssessmentSumaryIndexComponent} from './party-member/assessment-sumary/assessment-sumary-index.component';
import {AssessmentSumaryFormComponent} from './party-member/assessment-sumary/assessment-sumary-form/assessment-sumary-form.component';
import {AssessmentSumaryFormImportComponent} from './party-member/assessment-sumary/assessment-sumary-form-import/assessment-sumary-form-import.component';
import {AssessmentPartySignerIndexComponent} from './party-member/assessment-party-signer/assessment-party-signer-index/assessment-party-signer-index.component';
import {AssessmentPartySignerSumUpComponent} from './party-member/assessment-party-signer/assessment-party-signer-sum-up/assessment-party-signer-sum-up.component';
import {AssessmentPartySignerDetailComponent} from './party-member/assessment-party-signer/assessment-party-signer-detail/assessment-party-signer-detail.component';
import {DashboardPartyComponent} from "@app/modules/party/dashboard-party/dashboard-party.component";
import { EducationProcessMemberIndexComponent } from './party-member/education-process-member/education-process-member-index/education-process-member-index.component';
import {
    TransferPartyMemberWarningComponent
} from "@app/modules/party/transfer-party-member/transfer-party-member-warning/transfer-party-member-warning.component";
import { AdmissionManagementComponent } from './party-membership/admission-management/admission-management.component';
import { AdmissionProfileManagementComponent } from './party-membership/admission-profile-management/admission-profile-management.component';
import { AdmissionDecisionManagementComponent } from './party-membership/admission-decision-management/admission-decision-management.component';
import { AdmissionSympathyManagementComponent } from './party-membership/admission-sympathy-management/admission-sympathy-management.component';
import { AdmissionManagementAddComponent } from './party-membership/admission-management/admission-management-add/admission-management-add.component';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardPartyComponent,
    },
    {
        path: 'transfer-party-member',
        component: TransferPartyMemberIndexComponent,
    }, {
        path: 'transfer-party-member-warning',
        component: TransferPartyMemberWarningComponent,
    }, {
        path: 'transfer-party-member-add',
        component: TransferPartyMemberFormComponent,
    }, {
        path: 'transfer-party-member-edit/:id',
        component: TransferPartyMemberFormComponent,
    }, {
        path: 'transfer-party-member-view/:id/:view',
        component: TransferPartyMemberFormComponent,
    }, {
        path: 'party-member',
        component: PartyMemberIndexComponent,
        // },{
        //   path: 'party-member/:warningType',
        //   component: PartyMemberIndexComponent,
    }, {
        path: 'party-position',
        component: PartyPositionIndexComponent,
    }, {
        path: 'party-member/add',
        component: PartyMemberFormComponent,
    }, {
        path: 'party-member/import',
        component: PartyMemberFormImportComponent,
    }, {
        path: 'party-member-report',
        component: PartyMemberReportComponent,
    }, {
        // party-position
        path: 'party-position-add',
        component: PartyPositionFormComponent,
    }, {
        path: 'party-position-view/:id/:view',
        component: PartyPositionFormComponent,
    }, {
        path: 'party-position-edit/:id',
        component: PartyPositionFormComponent,
    }, {
        path: 'party-organization-management',
        loadChildren: './manager-party-organization/manager-party-organization.module#ManagerPartyOrganizationModule'
    }, {
        path: 'request-resolutions-month',
        component: RequestResolutionsMonthIndexComponent,
    }, {
        path: 'request-resolutions-month/request-resolutions-month-add',
        component: RequestResolutionMonthFormComponent,
    }, {
        path: 'request-resolutions-month/request-resolutions-month-view/:id/:mode',
        component: RequestResolutionMonthFormComponent,
    }, {
        path: 'request-resolutions-month/request-resolutions-month-edit/:id',
        component: RequestResolutionMonthFormComponent,
    }, {
        path: 'response-resolutions-month',
        component: ResponseResolutionMonthIndexComponent,
    }, {
        path: 'response-resolutions-month/:id/:action',
        component: ResponseResolutionMonthFormComponent,
    }, {
        path: 'response-resolutions-month/:id',
        component: ResponseResolutionMonthFormViewComponent,
    }, {
        path: 'resolution-quarter-year',
        component: ResolutionQuarterYearIndexComponent,
    }, {
        path: 'resolution-quarter-year/cate-criteria/:id/:action',
        component: ResolutionQuarterYearCriteriaComponent,
    }, {
        path: 'resolution-quarter-year/cate-criteria/:id/:action/:criteriaId',
        component: ResolutionQuarterYearCriteriaComponent,
    }, {
        path: 'cate-criteria',
        component: ResolutionQuarterYearCriteriaSearchComponent,
    }, {
        path: 'quality-analysis-party-organization',
        component: QualityAnalysisPartyOrganizationIndexComponent,
    }, {
        path: 'quality-analysis-party-organization-import',
        component: QualityAnalysisPartyOrganizationImportComponent,
    }, {
        path: 'quality-analysis-party-member',
        component: QualityAnalysisPartyMemberIndexComponent,
    }, {
        path: 'quality-analysis-party-member-import',
        component: QualityAnalysisPartyMemberImportComponent,
    }, {
        path: 'quality-analysis-party-report',
        component: QualityAnalysisPartyReportComponent,
    }, {
        path: 'reward-party-organization',
        component: RewardPartyOrganizationIndexComponent,
    }, {
        path: 'reward-party-organization-import',
        component: RewardPartyOrganizationImportComponent,
    }, {
        path: 'reward-party-member',
        component: RewardPartyMemberIndexComponent,
    }, {
        path: 'reward-party-member-import',
        component: RewardPartyMemberImportComponent,
    }, {
        path: 'reward-party-report',
        component: RewardPartyReportComponent,
    }, {
        path: 'question-and-answer',
        component: QuestionAndAnswerIndexComponent,
    }, {
        path: 'question-and-answer-add',
        component: QuestionAndAnswerFormComponent,
    }, {
        path: 'question-and-answer-edit/:id',
        component: QuestionAndAnswerFormComponent,
    }, {
        path: 'question-and-answer-view/:id',
        component: QuestionAndAnswerFormComponent,
    }, {
        path: 'answer-question/:id',
        component: QuestionAndAnswerFormComponent,
    }
    , {
        path: 'party-congress-employee',
        component: PartyCongressEmployeeIndexComponent,
    }
    , {
        path: 'party-congress-employee-import',
        component: PartyCongressEmployeeImportComponent,
    }
    , {
        path: 'party-congress-employee-report',
        component: PartyCongressEmployeeReportComponent,
    }
    , {
        path: 'party-congress-employee-add',
        component: PartyCongressEmployeeFormComponent,
    }
    , {
        path: 'party-congress-employee-edit/:id',
        component: PartyCongressEmployeeFormComponent,
    },
    {
        path: 'party-criticize',
        component: PartyCriticizeIndexComponent,
    }
    , {
        path: 'criticize-import',
        component: ImportPartyCriticizeComponent,
    }
    , {
        path: 'criticize-export',
        component: ReportPartyCriticizeComponent,
    }
    , {
        path: 'committees-report',
        component: CommitteesReportComponent,
    }, {
        path: 'transfer-member',
        component: PartyTransferReportComponent,
    }
    , {
        path: 'party-congress-employee-excerpt-report',
        component: PartyCongressEmployeeExcerptReportComponent,
    }
    , {
        path: 'party-member-clone',
        component: PartyMemberIndexCloneComponent,
    }
    , {
        path: 'party-member-exclusion/:id',
        component: PartyMemberExclusionComponent,
    }
    , {
        path: 'party-member-import-clone',
        component: PartyMemberFormImportCloneComponent,
    }, {
        path: 'party-member-add-clone',
        component: PartyMemberFormCloneComponent,
    }, {
        path: 'party-member-remove-name/:id',
        component: PartyMemberRemoveNameComponent,
    }
    // 203 start màn bổ sung đơn thị thực hiện
    , {
        path: 'request-resolutions-month-add-party-excute/:id/:mode',
        component: RequestResolutionMonthFormComponent,
    }
    , {
        path: 'home',
        component: PartyHomeIndexComponent,
    }
    // 203 end
    , {
        path: 'party-member-decision',
        component: PartyMemberDecisionIndexComponent,
    }, {
        path: 'party-member-decision/:decisionType/add',
        component: PartyMemberDecisionFormComponent,
    }, {
        path: 'party-member-decision/:decisionType/edit/:id',
        component: PartyMemberDecisionFormComponent,
    }, {
        path: 'party-member-decision/:decisionType/view/:id',
        component: PartyMemberDecisionFormComponent,
    },
    // d2t start bo sung chuc nang quan ly loai ho so Dang vien
    {
        path: 'party-member-profile-type',
        loadChildren: './party-member-profile-type/party-member-profile-type.module#PartyMemberProfileTypeModule'
    },
    {
        path: 'party-member/curriculum-vitae/:id',
        component: LayoutComponent,
        children: [
            {
                path: 'edit',
                component: PersonalInformationFormComponent
            },
            {
                path: 'view',
                component: PersonalInformationFormComponent,
            },
            {
                path: 'emp-type-process',
                component: EmpTypeProcessIndexComponent,
            },
            {
                path: 'party-profile',
                component: ProfileIndexComponent,
            },
            {
                path: 'employee-T63-infomation',
                component: EmployeeT63InfomationFormComponent,
            },
            {
                path: 'party-member-process',
                component: PartyMemberConcurrentProcessIndexComponent,
            },
            {
                path: 'quality-rating',
                component: QualityRatingPartyMemberComponent,
            },
            {
                path: 'reward',
                component: RewardPartyMemberComponent,
            },
            {
                path: 'work-process',
                component: WorkProcessMemberComponent
            },
            {
                path: 'punishment',
                component: PunishmentComponent
            },
            {
                path: 'education-process',
                component: EducationProcessMemberIndexComponent
            },
        ]
    },
    // d2t end
    {
        path: 'assessment-party-organization',
        component: AssessmentPartyOrganizationIndexComponent
    },
    {
        path: 'assessment-party-organization/sum-up',
        component: AssessmentPartyOrganizationSumUpComponent
    },
    {
        path: 'assessment-party-organization/detail/:id',
        component: AssessmentPartyOrganizationDetailComponent
    },
    {
        path: 'assessment-sumary',
        component: AssessmentSumaryIndexComponent
    },
    {
        path: 'assessment-sumary/import',
        component: AssessmentSumaryFormImportComponent
    },
    {
        path: 'assessment-sumary/add',
        component: AssessmentSumaryFormComponent
    },
    {
        path: 'assessment-sumary/:id',
        component: AssessmentSumaryFormComponent,
        children: [
            {
                path: 'edit',
                component: AssessmentSumaryFormComponent
            },
            {
                path: 'view',
                component: AssessmentSumaryFormComponent,
            },
        ]
    },
    {
        path: 'assessment-party-signer',
        component: AssessmentPartySignerIndexComponent
    },
    {
        path: 'assessment-party-signer/sum-up',
        component: AssessmentPartySignerSumUpComponent
    },
    {
        path: 'assessment-party-signer/detail/:id',
        component: AssessmentPartySignerDetailComponent
    },
    {
        path: 'assessment-sumary',
        component: AssessmentSumaryIndexComponent
    },
    // quản lý đợt kết nạp kết nạp đảng viên
    {
        path: 'admission_management',
        component: AdmissionManagementComponent,
    },
    {
        path: 'admission_management/add',
        component: AdmissionManagementAddComponent,
    },
    // quản lý hồ sơ kết nạp
    {
        path: 'admission_profile_management',
        component: AdmissionProfileManagementComponent,
    },
    // quản lý quyết định kết nạp
    {
        path: 'admission_decision_management',
        component: AdmissionDecisionManagementComponent,
    },
    // quản lý danh sách học cảm tình đảng
    {
        path: 'admission_sympathy_management',
        component: AdmissionSympathyManagementComponent,
    },
    {
        path: '**', redirectTo: '/home', pathMatch: 'full'

    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyRoutingModule { }
