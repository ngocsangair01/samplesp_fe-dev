// tslint:disable:max-line-length
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDynamicRoutingModule } from './report-dynamic-routing.module';
import { ReportDynamicIndexComponent } from './report-dynamic-index/report-dynamic-index.component';
import { ReportDynamicFormComponent } from './report-dynamic-form/report-dynamic-form.component';
import { SharedModule } from '@app/shared';
import { ReportDynamicParameterComponent } from './report-dynamic-form/form-childs/report-dynamic-parameter/report-dynamic-parameter.component';
import { ReportDynamicSqlComponent } from './report-dynamic-form/form-childs/report-dynamic-sql/report-dynamic-sql.component';
import { ReportDynamicColumnComponent } from './report-dynamic-form/form-childs/report-dynamic-column/report-dynamic-column.component';
import { FilterPipe, ReportDynamicExportComponent } from './report-dynamic-export/report-dynamic-export.component';
import { ReportInputGenerateDirective } from './report-dynamic-export/report-input-generate.directive';
import { InputTextComponent } from './report-dynamic-export/entry-components/input-text.component';
import { InputDatePickerComponent } from './report-dynamic-export/entry-components/input-date-picker.component';
import { InputOrgSelectorComponent } from './report-dynamic-export/entry-components/input-org-selector.component';
import { InputGenderComponent } from './report-dynamic-export/entry-components/input-gender.component';
import { InputComboboxComponent } from './report-dynamic-export/entry-components/input-combobox.component';
import { InputPartyOrgSelectorComponent } from './report-dynamic-export/entry-components/input-party-org-selector.component';
import { InputWomenOrgSelectorComponent } from './report-dynamic-export/entry-components/input-women-org-selector.component';
import { ReportDynamicViewerComponent } from './report-dynamic-viewer/report-dynamic-viewer.component';
import { SafePipe } from '@app/shared/pipes/safe.pipe';
import { InputYouthOrgSelectorComponent } from './report-dynamic-export/entry-components/input-youth-org-selector.component';
import { InputUnionOrgSelectorComponent } from './report-dynamic-export/entry-components/input-union-org-selector.component';
import { InputPositionSelectorComponent } from './report-dynamic-export/entry-components/input-position-selector.component';
import { InputPartyPositionSelectorComponent } from './report-dynamic-export/entry-components/input-party-position-selector.component';
import { InputMassPositionWomenSelectorComponent } from './report-dynamic-export/entry-components/input-mass-position-women-selector.component';
import { InputMassPositionYouthSelectorComponent } from './report-dynamic-export/entry-components/input-mass-position-youth-selector.component';
import { InputMassPositionUnionSelectorComponent } from './report-dynamic-export/entry-components/input-mass-position-union-selector.component';
import { InputEmployeeSelectorComponent } from './report-dynamic-export/entry-components/input-employee-selector.component';
import { InputEmployeeManagerSelectorComponent } from './report-dynamic-export/entry-components/input-employee-manager-selector.component';
import { InputPartyMemberSelectorComponent } from './report-dynamic-export/entry-components/input-party-member-selector.component';
import { InputMassMemberWomenSelectorComponent } from './report-dynamic-export/entry-components/input-mass-member-women-selector.component';
import { InputMassMemberYouthSelectorComponent } from './report-dynamic-export/entry-components/input-mass-member-youth-selector.component';
import { InputMassMemberUnionSelectorComponent } from './report-dynamic-export/entry-components/input-mass-member-union-selector.component';
import { FilterPipeNew, ReportDynamicExportNewComponent } from './report-dynamic-export-new/report-dynamic-export-new.component';
import {
  ReportDynamicExportNewPopupComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export-new/report-dynamic-export-new-popup/report-dynamic-export-new-popup.component";
import {
  InputUnionOrgNoPermissionSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-union-org-no-permission-selector.component";

@NgModule({
  declarations: [ReportDynamicIndexComponent,
    ReportDynamicFormComponent,
    ReportDynamicParameterComponent,
    ReportDynamicSqlComponent,
    ReportDynamicColumnComponent,
    ReportDynamicExportComponent,
    ReportDynamicExportNewComponent,
    ReportInputGenerateDirective,
    InputTextComponent,
    InputDatePickerComponent,
    InputOrgSelectorComponent,
    InputPartyOrgSelectorComponent,
    InputGenderComponent,
    InputComboboxComponent,
    InputYouthOrgSelectorComponent,
    FilterPipe,
    FilterPipeNew,
    InputWomenOrgSelectorComponent,
    InputUnionOrgSelectorComponent,
    InputUnionOrgNoPermissionSelectorComponent,
    ReportDynamicViewerComponent,
    InputPositionSelectorComponent,
    InputPartyPositionSelectorComponent,
    InputMassPositionWomenSelectorComponent,
    InputMassPositionYouthSelectorComponent,
    InputMassPositionUnionSelectorComponent,
    InputEmployeeSelectorComponent,
    InputEmployeeManagerSelectorComponent,
    InputPartyMemberSelectorComponent,
    InputMassMemberWomenSelectorComponent,
    InputMassMemberYouthSelectorComponent,
    InputMassMemberUnionSelectorComponent,
    ReportDynamicExportNewPopupComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReportDynamicRoutingModule
  ],
  entryComponents: [InputTextComponent,
    InputDatePickerComponent,
    InputGenderComponent,
    InputComboboxComponent,
    InputOrgSelectorComponent,
    InputPartyOrgSelectorComponent,
    InputWomenOrgSelectorComponent,
    InputYouthOrgSelectorComponent,
    InputUnionOrgSelectorComponent,
    ReportDynamicViewerComponent,
    InputPositionSelectorComponent,
    InputPartyPositionSelectorComponent,
    InputMassPositionWomenSelectorComponent,
    InputMassPositionYouthSelectorComponent,
    InputMassPositionUnionSelectorComponent,
    InputEmployeeSelectorComponent,
    InputEmployeeManagerSelectorComponent,
    InputPartyMemberSelectorComponent,
    InputUnionOrgNoPermissionSelectorComponent,
    InputMassMemberWomenSelectorComponent,
    InputMassMemberYouthSelectorComponent,
    InputMassMemberUnionSelectorComponent,
    ReportDynamicExportNewPopupComponent],
  providers: [SafePipe]
})
export class ReportDynamicModule { }
