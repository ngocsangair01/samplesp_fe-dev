import { EmployeeAssessmentReportComponent } from './report/employee-assessment-report/employee-assessment-report.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './curriculum-vitae/layout/layout.component';
import { PersonalInformationFormComponent } from './curriculum-vitae/personal-information/personal-information-form/personal-information-form.component';
import { PartyStructureReportComponent } from './report/party-structure-report.component';
import { PartyExpiredReportComponent } from './report/party-expired-report.component';
import { EmployeeT63InfomationFormComponent } from './curriculum-vitae/employee-t63-infomation/employee-t63-infomation-form/employee-t63-infomation-form.component';
import { GroupOrgPositionReportComponent } from './report/group-org-position-report/group-org-position-report.component';
import { CurriculumVitaeIndexComponent } from './curriculum-vitae/curriculum-vitae-index/curriculum-vitae-index.component';
import { EmpFileIndexComponent } from './curriculum-vitae/emp-file/emp-file-index/emp-file-index.component';
import { EmpTypeProcessIndexComponent } from './curriculum-vitae/emp-type-process/emp-type-process-index/emp-type-process-index.component';
import { PartyMemberConcurrentProcessIndexComponent } from './curriculum-vitae/party-member-concurrent-process/party-member-concurrent-process-index/party-member-concurrent-process-index.component';
import { ReligionReportComponent } from './report/religion-report/religion-report.component';
import { OfficerProfileIndexComponent } from './curriculum-vitae/officer-profile/officer-profile-index/officer-profile-index.component';
import { RetirementReportComponent } from './report/retirement-report/retirement-report.component';
import { EmployeeImportComponent } from './import/employee-import.component';
import { EmployeeReportComponent } from './report/employee-report/employee-report.component';
import { DeathGratuityReportComponent } from './report/death-gratuity-report/death-gratuity-report.component';
import { EmpTypePolicyReportComponent } from './report/emp-type-policy-report/emp-type-policy-report.component';
import { AssessmentIndexComponent } from './curriculum-vitae/assessment/assessment-index/assessment-index.component';
import { SendWarningEmpFileIndexComponent } from './send-warning-emp-file/send-warning-emp-file-index/send-warning-emp-file-index.component';
import { QualityRatingPartyMemberComponent } from './curriculum-vitae/quality-rating-party-member/quality-rating-party-member.component';
import { MemberJoinCongressComponent } from './curriculum-vitae/layout/member-join-congress/member-join-congress.component';
import { RewardPartyMemberComponent } from './curriculum-vitae/reward-party-member/reward-party-member.component';
import { VicinityPositionPlanFormComponent } from './vicinity-plan/vicinity-position-plan/vicinity-position-plan-form/vicinity-position-plan-form.component';
import { VicinityPositionPlanIndexComponent } from './vicinity-plan/vicinity-position-plan/vicinity-position-plan-index/vicinity-position-plan-index.component';
import { VicinityEmployeePlanFormComponent } from './vicinity-plan/vicinity-employee-plan/vicinity-employee-plan-form/vicinity-employee-plan-form.component';
import { VicinityEmployeePlanIndexComponent } from './vicinity-plan/vicinity-employee-plan/vicinity-employee-plan-index/vicinity-employee-plan-index.component';
import { VicinityPositionPlanImportComponent } from './vicinity-plan/vicinity-position-plan/vicinity-position-plan-import/vicinity-position-plan-import.component';
import { VicinityEmployeePlanImportComponent } from './vicinity-plan/vicinity-employee-plan/vicinity-employee-plan-import/vicinity-employee-plan-import.component';
import { VicinityPlanReportComponent } from './vicinity-plan/vicinity-plan-report/vicinity-plan-report.component';
import { ServeArmyAgeReportComponent } from './report/serve-army-age-report/serve-army-age-report.component';
import { ViewAllPersonalInfoIndex } from './curriculum-vitae/view-all-personal-information/view-all-personal-info-index/view-all-personal-info-index.component';
import { PartyExpiredDetailReportComponent } from './report/party-expired-detail-report/party-expired-detail-report.component';
import { DetailsOfManagersComponent } from './report/details-of-managers/details-of-managers.component';
import { KeyProjectComponent } from './curriculum-vitae/view-all-personal-information/key-project/key-project.component';
import { WorkProcessMemberComponent } from './curriculum-vitae/work-process-member/work-process-member.component';
import { PunishmentComponent } from './curriculum-vitae/view-all-personal-information/punishment/punishment.component';

import { VicinityPositionPlanIndexCloneComponent } from './vicinity-plan/vicinity-position-plan clone/vicinity-position-plan-index/vicinity-position-plan-index.component';
import { VicinityPositionPlanFormCloneComponent } from './vicinity-plan/vicinity-position-plan clone/vicinity-position-plan-form/vicinity-position-plan-form.component';
import { VicinityPositionPlanImportCloneComponent } from './vicinity-plan/vicinity-position-plan clone/vicinity-position-plan-import/vicinity-position-plan-import.component';
import { VicinityPositionPlanDetailCloneComponent } from './vicinity-plan/vicinity-position-plan clone/vicinity-position-plan-detail/vicinity-position-plan-detail.component';
import { VicinityPositionPlanRotationCloneComponent } from './vicinity-plan/vicinity-position-plan clone/vicinity-position-plan-rotation/vicinity-position-plan-rotation.component';
import { PersonalInformationFormCloneComponent } from './curriculum-vitae/personal-information-clone/personal-information-form-clone/personal-information-form-clone.component';
import { LayoutCloneComponent } from './curriculum-vitae/layout-clone/layout-clone.component';
import { StaffAssessmentCriteriaGroupIndexComponent } from './staff-assessment/staff-assessment-criteria-group/staff-assessment-criteria-group-index/staff-assessment-criteria-group-index.component';
import { StaffAssessmentCriteriaGroupFormComponent } from './staff-assessment/staff-assessment-criteria-group/staff-assessment-criteria-group-form/staff-assessment-criteria-group-form.component';
import { StaffAssessmentCriteriaIndexComponent } from './staff-assessment/staff-assessment-criteria/staff-assessment-criteria-index/staff-assessment-criteria-index.component';
import { ListStaffAssessmentCriteriaComponent } from './staff-assessment/staff-assessment-criteria-group/list-staff-assessment-criteria/list-staff-assessment-criteria.component';
import { StaffAssessmentCriteriaFormComponent } from './staff-assessment/staff-assessment-criteria/staff-assessment-criteria-form/staff-assessment-criteria-form.component';
import { RewardGeneralComponent } from './curriculum-vitae/reward-general/reward-general.component';
import { EmployeeRetiredIndexComponent } from './employee-retired/employee-retired-index/employee-retired-index.component';
import { RetiredInformationFormComponent } from './employee-retired/retired-information-form/retired-information-form.component';
import { LayoutEmployeeComponent } from './employee-retired/layout-emloyee/layout-emloyee.component';
import {DashboardEmployeeComponent} from "@app/modules/employee/dashboard-employee/dashboard-employee.component";
import { PopulationProcessMemberComponent } from './curriculum-vitae/population-process-member/population-process-member.component';
import { EducationProcessMemberIndexComponent } from './curriculum-vitae/education-process-member/education-process-member-index/education-process-member-index.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardEmployeeComponent,
  },
  {
    path: 'curriculum-vitae',
    component: CurriculumVitaeIndexComponent,
  },{
    path: 'retired',
    component: EmployeeRetiredIndexComponent,
  }, {
    path: 'retired/:warningType',
    component: EmployeeRetiredIndexComponent,
  },{
    path: 'retired/:id',
    component: LayoutEmployeeComponent,
    children: [
      {
        path: 'edit',
        component: RetiredInformationFormComponent,
      },
      {
        path: 'view',
        component: RetiredInformationFormComponent,
      },
    ]
  }, {
    path: 'curriculum-vitae/:warningType',
    component: CurriculumVitaeIndexComponent,
  }, {
    path: 'curriculum-vitae/:id',
    component : LayoutComponent,
    children: [
      {
        path: 'edit',
        component : PersonalInformationFormComponent,
      },
      {
        path: 'view',
        component : PersonalInformationFormComponent,
      },
      {
        path: 'emp-type-process',
        component : EmpTypeProcessIndexComponent,
      },
      {
        path: 'emp-profile',
        component : EmpFileIndexComponent,
      },
      {
        path: 'employee-T63-infomation',
        component : EmployeeT63InfomationFormComponent,
      },
      {
        path: 'party-member-process',
        component : PartyMemberConcurrentProcessIndexComponent,
      },
      {
        path: 'officer-profile',
        component : OfficerProfileIndexComponent,
      },
      {
        path: 'assessment',
        component : AssessmentIndexComponent,
      },
      {
        path: 'quality-rating',
        component : QualityRatingPartyMemberComponent,
      },
      {
        path: 'join-congress',
        component: MemberJoinCongressComponent,  // tham gia dai hoi
      },
      {
        path: 'reward',
        component : RewardPartyMemberComponent,
      },
      {
        path: 'reward-general',
        component : RewardGeneralComponent,
      },
      {
        path: 'key-project',
        component : KeyProjectComponent,
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
        path: 'population-process',
        component: PopulationProcessMemberComponent
      },
      {
        path: 'education-process',
        component: EducationProcessMemberIndexComponent
      },
    ]
  }, {
    path: 'party-structure-report',
    component: PartyStructureReportComponent,
  }, {
    path: 'party-expired-report',
    component: PartyExpiredReportComponent,
  }, {
    path: 'group-org-position-report',
    component: GroupOrgPositionReportComponent,
  }, {
    path: 'religion-report',
    component: ReligionReportComponent,
  }, {
    path: 'retirement-report',
    component: RetirementReportComponent,
  }, {
    path: 'employee-import',
    component: EmployeeImportComponent,
  }, {
    path: 'employee-report',
    component: EmployeeReportComponent,
  }, {
    path: 'death-gratuity-report',
    component: DeathGratuityReportComponent,
  }, {
    path: 'emp-type-policy-report',
    component: EmpTypePolicyReportComponent,
  }, {
    path: 'send-warning-emp-file',
    component: SendWarningEmpFileIndexComponent,
  }, {
    path: 'employee-assessment-report',
    component: EmployeeAssessmentReportComponent,
  },{
    path: '',
    loadChildren: './transfer-employee/transfer-employee.module#TransferEmployeeModule'
  },{
    path: 'vicinity-position-plan',
    component: VicinityPositionPlanIndexComponent,
  }, {
    path: 'vicinity-position-plan-add',
    component: VicinityPositionPlanFormComponent,
  },{
    path: 'vicinity-position-plan-edit/:vicinityPositionPlanId',
    component: VicinityPositionPlanFormComponent,
  }, {
    path: 'vicinity-position-plan-import',
    component: VicinityPositionPlanImportComponent,
  }, {
    path: 'vicinity-employee-plan',
    component: VicinityEmployeePlanIndexComponent,
  }, {
    path: 'vicinity-employee-plan-add',
    component: VicinityEmployeePlanFormComponent,
  }, {
    path: 'vicinity-employee-plan-edit/:vicinityPositionPlanId',
    component: VicinityEmployeePlanFormComponent,
  }, {
    path: 'vicinity-employee-plan-import',
    component: VicinityEmployeePlanImportComponent,
  }, {
    path: 'vicinity-plan-report',
    component: VicinityPlanReportComponent,
  }, {
    path: 'serve-army-age-detail-report',
    component: ServeArmyAgeReportComponent,
  }, {
    path: 'party-expired-detail-report',
    component: PartyExpiredDetailReportComponent,
  }, {
    path: 'details-of-managers',
    component: DetailsOfManagersComponent,
  }, {
    path: 'curriculum-vitae/:empOverallInfoId/overall-info',
    component: ViewAllPersonalInfoIndex,
  }
  ,{
    path: 'vicinity-position-plan-clone',
    component: VicinityPositionPlanIndexCloneComponent,
  }, {
    path: 'vicinity-position-plan-clone/add',
    component: VicinityPositionPlanFormCloneComponent,
  },
  {
    path: 'vicinity-position-plan-clone/edit/:vicinityPositionPlanId/:vicinityPlanMappingId',
    component: VicinityPositionPlanFormCloneComponent,
  }, {
    path: 'vicinity-position-plan-clone/import',
    component: VicinityPositionPlanImportCloneComponent,
  }, {
    path: 'vicinity-position-plan-clone/detail/:vicinityPositionPlanId',
    component: VicinityPositionPlanDetailCloneComponent,
  }, {
    path: 'vicinity-position-plan-clone/rotation/:vicinityPlanMappingId',
    component: VicinityPositionPlanRotationCloneComponent,
  }, {
    path: 'curriculum-vitae-clone/:id',
    component : LayoutCloneComponent,
    children: [
      {
        path: 'edit',
        component : PersonalInformationFormCloneComponent,
      },
      {
        path: 'view',
        component : PersonalInformationFormCloneComponent,
      }
    ]
  }, {
    path: 'assessment-criteria-group',
    component: StaffAssessmentCriteriaGroupIndexComponent,
  }, {
    path: 'assessment-criteria-group-add',
    component: StaffAssessmentCriteriaGroupFormComponent,
  }
  , {
    path: 'assessment-criteria-group-edit/:staffAssessmentCriteriaGroupId',
    component: StaffAssessmentCriteriaGroupFormComponent,
  },  {
    path: 'staff-assessment-criteria',
    component: StaffAssessmentCriteriaIndexComponent,
  }, {
    path: 'assessment/manager-field',
    loadChildren: '../employee/staff-assessment/assessment-period/assessment-period.module#AssessmentPeriodModule'
  },{
    path: 'assessment-criteria',
    component: StaffAssessmentCriteriaIndexComponent,
  },   {
    path: 'assessment-criteria/get-list-staff-assessment-criteria/:staffAssessmentCriteriaGroupId',
    component: ListStaffAssessmentCriteriaComponent,
  }, {
    path: 'assessment-criteria-add', 
    component: StaffAssessmentCriteriaFormComponent,
  }, {
    path: 'assessment-criteria-edit/:staffAssessmentCriteriaId',
    component: StaffAssessmentCriteriaFormComponent,
  }, {
    path: 'assessment-formula',
    loadChildren: '../employee/staff-assessment/assessment-formula/assessment-formula.module#AssessmentFormulaModule'
  },{
    path: 'assessment/manager-field',
    loadChildren: '../employee/staff-assessment/assessment-period/assessment-period.module#AssessmentPeriodModule'
  },{
    path: 'emp-army-proposed',
    loadChildren: './emp-army-proposed/emp-army-proposed.module#EmpArmyProposedModule'
  },{
    path: 'config-army-condition',
    loadChildren: './config-army-condition/config-army-condition.module#ConfigArmyConditionModule'
  },{
    path: 'army-proposed-template',
    loadChildren: './army-proposed-template/army-proposed-template.module#ArmyProposedTemplateModule'
  },{
    path: 'organization',
    loadChildren: './organization/organization-manager.module#OrganizationManagerModule'
  },{
    path: 'assessment-monitor',
    loadChildren: '../employee/staff-assessment/assessment-monitor/assessment-monitor.module#AssessmentMonitorModule'
  },{
    path: 'thorough-content',
    loadChildren: './thorough-content/thorough-content.module#ThoroughContentModule'
  },{
    path: 'exam-question-set',
    loadChildren: './exam-question-set/exam-question-set.module#ExamQuestionSetModule'
  },{
    path: 'progress-track',
    loadChildren: './progress-track/progress-track.module#ProgressTrackModule'
  },{
    path: 'task',
    loadChildren: './task/task.module#TaskModule'
  }
  , {
    path: 'training-topic',
    loadChildren: './training-topic/training-topic.module#TrainingTopicModule'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {
}
