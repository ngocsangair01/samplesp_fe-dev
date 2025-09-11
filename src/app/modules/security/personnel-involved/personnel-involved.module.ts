import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonnelInvolvedRoutingModule } from './personnel-involved-routing.module';
import { PersonnelInvolvedIndexComponent } from './personnel-involved-index/personnel-involved-index.component';
import { PersonnelInvolvedSearchComponent } from './personnel-involved-search/personnel-involved-search.component';
import { PersonnelInvolvedImportComponent } from './personnel-involved-import/personnel-involved-import.component';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    PersonnelInvolvedIndexComponent,
    PersonnelInvolvedSearchComponent,
    PersonnelInvolvedImportComponent],
  imports: [
    SharedModule,
    CommonModule,
    PersonnelInvolvedRoutingModule
  ]
})
export class PersonnelInvolvedModule { }
