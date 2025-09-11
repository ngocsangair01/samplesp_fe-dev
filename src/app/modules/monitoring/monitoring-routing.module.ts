import { ReportPunishmentIncreaseDecreaseComponent } from './report-punishment-increase-decrease/report-punishment-increase-decrease.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisciplineViolationReportComponent } from './discipline-violation-report/discipline-violation-report.component';
import { PartyPunishmentIndexComponent } from './party-punishment/party-punishment-index/party-punishment-index.component';
import { PartyPunishmentImportComponent } from './party-punishment/party-punishment-import/party-punishment-import.component';
import { PersonalPunishmentSearchComponent } from './personal-punishment-managerment/personal-punishment-search/personal-punishment-search.component';
import { PersonalPunishmentFormComponent } from './personal-punishment-managerment/personal-punishment-form/personal-punishment-form.component';
import { PersonalPunishmentImportComponent } from './personal-punishment-managerment/personal-punishment-import/personal-punishment-import.component';
import { InspectionPlanIndexComponent } from './inspection-plan/inspection-plan-index/inspection-plan-index.component';
import { InspectionPlanFormComponent } from './inspection-plan/inspection-plan-form/inspection-plan-form.component';
import {DashboardMonitoringComponent} from "@app/modules/monitoring/dashboard-monitoring/dashboard-monitoring.component";

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardMonitoringComponent,
  },{
    path: 'discipline-violation-report',
    component: DisciplineViolationReportComponent,
  },
  {
    path: 'party-punishment-management',
    component: PartyPunishmentIndexComponent,
  },
  {
    path: 'party-punishment-management/import',
    component: PartyPunishmentImportComponent,
  },
  {
    path: "personal-punishment-managerment",
    component: PersonalPunishmentSearchComponent,
  },
  {
    path: "personal-punishment-managerment/add",
    component: PersonalPunishmentFormComponent
  },
  {
    path: "personal-punishment-managerment/edit/:id",
    component: PersonalPunishmentFormComponent
  },
  {
    path: "personal-punishment-managerment/import",
    component: PersonalPunishmentImportComponent,
  },
  {
    path: "discipline-increase-decrease",
    component: ReportPunishmentIncreaseDecreaseComponent,
  },
  {
    path: "inspection-plan",
    component: InspectionPlanIndexComponent
  },
  {
    path: "inspection-plan/view/:id",
    component: InspectionPlanFormComponent
  },
  {
    path: "inspection-plan/add",
    component: InspectionPlanFormComponent
  },
  {
    path: "inspection-plan/edit/:id",
    component: InspectionPlanFormComponent
  },
  {
    path: "letter-denunciation",
    loadChildren: '../monitoring/letter-denunciation/letter-denunciation.module#LetterDenunciationModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringRoutingModule { }
