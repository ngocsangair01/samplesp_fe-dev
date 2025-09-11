import { NgModule } from '@angular/core';

import { EmailSmsDynamicRoutingModule } from './email-sms-dynamic-routing.module';
import { EmailSmsDynamicIndexComponent } from './email-sms-dynamic-index/email-sms-dynamic-index.component';
import { EmailSmsDynamicSearchComponent } from './email-sms-dynamic-search/email-sms-dynamic-search.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { ReportInputGenerateDirective } from './email-sms-dynamic-export/report-input-generate.directive';
import {
  InputTextComponent
} from "./email-sms-dynamic-export/entry-components/input-text.component";
import {
  InputYouthOrgSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-youth-org-selector.component";
import {
  InputPartyPositionSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-party-position-selector.component";
import {
  InputEmployeeManagerSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-employee-manager-selector.component";
import {
  InputDatePickerComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-date-picker.component";
import {
  InputMassMemberUnionSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-mass-member-union-selector.component";
import {
  InputComboboxComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-combobox.component";
import {
  InputGenderComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-gender.component";
import {
  InputUnionOrgSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-union-org-selector.component";
import {
  InputMassPositionYouthSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-mass-position-youth-selector.component";
import {
  InputMassMemberWomenSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-mass-member-women-selector.component";
import {
  InputMassMemberYouthSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-mass-member-youth-selector.component";
import {
  InputPartyMemberSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-party-member-selector.component";
import {
  InputEmployeeSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-employee-selector.component";
import {
  InputWomenOrgSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-women-org-selector.component";
import {
  InputMassPositionWomenSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-mass-position-women-selector.component";
import {
  InputMassPositionUnionSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-mass-position-union-selector.component";
import {
  InputPositionSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-position-selector.component";
import {
  InputPartyOrgSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-party-org-selector.component";
import {
  InputOrgSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-org-selector.component";
import {
  PreviewEmailContentShowmoreComponent
} from "@app/modules/settings/email-sms-dynamic/preview-email-content-showmore/preview-email-content-showmore.component";
import {
  EmailSmsDynamicSearchPopupComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-search/email-sms-dynamic-search-popup/email-sms-dynamic-search-popup.component";
@NgModule({
  declarations: [
    EmailSmsDynamicIndexComponent,
    EmailSmsDynamicSearchComponent,
    ReportInputGenerateDirective,
    InputTextComponent,
    InputDatePickerComponent,
    InputOrgSelectorComponent,
    InputPartyOrgSelectorComponent,
    InputGenderComponent,
    InputComboboxComponent,
    InputYouthOrgSelectorComponent,
    InputWomenOrgSelectorComponent,
    InputUnionOrgSelectorComponent,
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
    PreviewEmailContentShowmoreComponent,
    EmailSmsDynamicSearchPopupComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EmailSmsDynamicRoutingModule
  ],
  entryComponents: [
    InputTextComponent,
    InputDatePickerComponent,
    InputGenderComponent,
    InputComboboxComponent,
    InputOrgSelectorComponent,
    InputPartyOrgSelectorComponent,
    InputWomenOrgSelectorComponent,
    InputYouthOrgSelectorComponent,
    InputUnionOrgSelectorComponent,
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
    PreviewEmailContentShowmoreComponent,
    EmailSmsDynamicSearchPopupComponent,
  ],
  providers: [
  ]
})
export class EmailSmsDynamicModule { }
