import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitRegistrationRoutingModule } from './competition-unit-registration-routing.module';
import { UnitRegistrationIndexComponent } from './competition-unit-registration-index/competition-unit-registration-index.component';
import { UnitRegistrationSearchComponent } from './competition-unit-registration-search/competition-unit-registration-search.component';
import {SharedModule} from "@app/shared";
import {UnitRegistrationCompetitionFormComponent} from "./competition-unit-registration-competition-form/competition-unit-registration-competition-form.component";
import {UnitRegistrationUpdateResultComponent} from "./competition-unit-registration-update-result/competition-unit-registration-update-result.component";
import {UnitRegistrationViewComponent} from "@app/modules/competition-unit-registration/competition-unit-registration-view/competition-unit-registration-view.component";
import {
  CompetitionUnitRegistrationImportComponent
} from "@app/modules/competition-unit-registration/competition-unit-registration-search/competition-unit-registration-import/competition-unit-registration-import.component";

@NgModule({
  declarations: [UnitRegistrationIndexComponent, UnitRegistrationSearchComponent,
    UnitRegistrationCompetitionFormComponent, UnitRegistrationUpdateResultComponent,
    UnitRegistrationViewComponent, CompetitionUnitRegistrationImportComponent],
  imports: [
    CommonModule,
    SharedModule,
    UnitRegistrationRoutingModule
  ],
  entryComponents:[
      UnitRegistrationUpdateResultComponent,
    CompetitionUnitRegistrationImportComponent
  ]
})
export class UnitRegistrationModule { }
