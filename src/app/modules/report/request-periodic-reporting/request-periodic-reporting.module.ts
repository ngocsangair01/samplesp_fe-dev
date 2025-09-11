import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import {IndexComponent} from "@app/modules/report/request-periodic-reporting/index/index.component";
import {
  InputComboboxComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-combobox.component";
import {
  DynamicReportComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/dynamic-report.component";
import {
  InputDatePickerComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-date-picker.component";
import {
  InputEmployeeManagerSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-employee-manager-selector.component";
import {
  InputMassMemberWomenSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-mass-member-women-selector.component";
import {
  ReportInputGenerateDirective
} from "@app/modules/report/request-periodic-reporting/dynamic-report/report-input-generate.directive";
import {
  InputPositionSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-position-selector.component";
import {
  InputYouthOrgSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-youth-org-selector.component";
import {
  InputGenderComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-gender.component";
import {
  InputMassPositionUnionSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-mass-position-union-selector.component";
import {
  InputEmployeeSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-employee-selector.component";
import {
  InputMassMemberUnionSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-mass-member-union-selector.component";
import {
  InputPartyPositionSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-party-position-selector.component";
import {
  InputPartyOrgSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-party-org-selector.component";
import {
  InputPartyMemberSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-party-member-selector.component";
import {
  InputOrgSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-org-selector.component";
import {
  InputMassPositionYouthSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-mass-position-youth-selector.component";
import {
  InputMassPositionWomenSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-mass-position-women-selector.component";
import {
  RequestPeriodicReportingRoutingModule
} from "@app/modules/report/request-periodic-reporting/request-periodic-reporting-routing.module";
import {
  InputMassMemberYouthSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-mass-member-youth-selector.component";
import {
  InputTextComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-text.component";
import {
  InputUnionOrgSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-union-org-selector.component";
import {
  InputWomenOrgSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-women-org-selector.component";

@NgModule({
  declarations: [
    IndexComponent,
    DynamicReportComponent,
    InputComboboxComponent,
    InputDatePickerComponent,
    InputEmployeeManagerSelectorComponent,
    InputEmployeeSelectorComponent,
    ReportInputGenerateDirective,
    InputGenderComponent,
    InputMassMemberUnionSelectorComponent,
    InputMassMemberWomenSelectorComponent,
    InputMassMemberYouthSelectorComponent,
    InputMassPositionUnionSelectorComponent,
    InputMassPositionWomenSelectorComponent,
    InputMassPositionYouthSelectorComponent,
    InputOrgSelectorComponent,
    InputPartyMemberSelectorComponent,
    InputPartyOrgSelectorComponent,
    InputPartyPositionSelectorComponent,
    InputPositionSelectorComponent,
    InputTextComponent,
    InputUnionOrgSelectorComponent,
    InputWomenOrgSelectorComponent,
    InputYouthOrgSelectorComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RequestPeriodicReportingRoutingModule,
  ],
  entryComponents: [
    InputComboboxComponent,
    InputDatePickerComponent,
    InputEmployeeManagerSelectorComponent,
    InputEmployeeSelectorComponent,
    InputGenderComponent,
    InputMassMemberUnionSelectorComponent,
    InputMassMemberWomenSelectorComponent,
    InputMassMemberYouthSelectorComponent,
    InputMassPositionWomenSelectorComponent,
    InputMassPositionYouthSelectorComponent,
    InputOrgSelectorComponent,
    InputPartyMemberSelectorComponent,
    InputPartyOrgSelectorComponent,
    InputPartyPositionSelectorComponent,
    InputPositionSelectorComponent,
    InputTextComponent,
    InputUnionOrgSelectorComponent,
    InputWomenOrgSelectorComponent,
    InputYouthOrgSelectorComponent
]
})
export class RequestPeriodicReportingModule { }
