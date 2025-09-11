import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { MonitoringRoutingModule } from './monitoring-routing.module';
import { DisciplineViolationReportComponent } from './discipline-violation-report/discipline-violation-report.component';
import { PartyPunishmentSearchComponent } from './party-punishment/party-punishment-search/party-punishment-search.component';
import { PartyPunishmentIndexComponent } from './party-punishment/party-punishment-index/party-punishment-index.component';
import { PartyPunishmentFormComponent } from './party-punishment/party-punishment-form/party-punishment-form.component';
import { PartyPunishmentImportComponent } from './party-punishment/party-punishment-import/party-punishment-import.component';
import { PersonalPunishmentFormComponent } from './personal-punishment-managerment/personal-punishment-form/personal-punishment-form.component';
import { PersonalPunishmentSearchComponent } from './personal-punishment-managerment/personal-punishment-search/personal-punishment-search.component';
import { PersonalPunishmentImportComponent } from './personal-punishment-managerment/personal-punishment-import/personal-punishment-import.component';
import { ReportPunishmentIncreaseDecreaseComponent } from './report-punishment-increase-decrease/report-punishment-increase-decrease.component';
import { InspectionPlanIndexComponent } from './inspection-plan/inspection-plan-index/inspection-plan-index.component';
import { InspectionPlanSearchComponent } from './inspection-plan/inspection-plan-search/inspection-plan-search.component';
import { InspectionPlanFormComponent } from './inspection-plan/inspection-plan-form/inspection-plan-form.component';
import { DashboardMonitoringComponent } from './dashboard-monitoring/dashboard-monitoring.component';

@NgModule({
  declarations: [
    PartyPunishmentSearchComponent,
    PartyPunishmentIndexComponent,
    PartyPunishmentFormComponent,
    PartyPunishmentImportComponent,
    PersonalPunishmentSearchComponent,
    PersonalPunishmentFormComponent,
    PersonalPunishmentImportComponent,
    ReportPunishmentIncreaseDecreaseComponent,
    DisciplineViolationReportComponent,
    InspectionPlanIndexComponent,
    InspectionPlanSearchComponent,
    InspectionPlanFormComponent,
    DashboardMonitoringComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MonitoringRoutingModule
  ],
  entryComponents: [
    PartyPunishmentFormComponent
  ]
})
export class MonitoringModule { }
