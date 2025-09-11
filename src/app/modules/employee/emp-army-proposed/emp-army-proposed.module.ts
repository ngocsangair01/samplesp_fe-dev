import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared';
import { EmpArmyProposedSearchComponent } from './emp-army-proposed-search/emp-army-proposed-search.component'
import { EmpArmyProposedAddComponent } from './emp-army-proposed-add/emp-army-proposed-add.component'
import { EmpArmyProposedIndexComponent } from './emp-army-proposed-index/emp-army-proposed-index.component'
import { EmpArmyProposedRoutingModule } from './emp-army-proposed-routing.module'
import { EmpArmyProposedAdditionalComponent } from './emp-army-proposed-additional/emp-army-proposed-additional.component';
import { EmpArmyProposedSystemIndexComponent } from './emp-army-proposed-system-index/emp-army-proposed-system-index.component';
import { EmpArmyProposedSystemSearchComponent } from './emp-army-proposed-system-search/emp-army-proposed-system-search.component';
import { OrgArmyProposedComponent } from './org-army-proposed/org-army-proposed.component';
import { EmpArmyProposedExportComponent } from './emp-army-proposed-export/emp-army-proposed-export.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {
  empArmyProposedUpdateSignUnit
} from "@app/modules/employee/emp-army-proposed/emp-army-proposed-update-sign-unit/emp-army-proposed-update-sign-unit";
import {
  EmpArmyProposedAddSelectFilterComponent
} from "@app/modules/employee/emp-army-proposed/emp-army-proposed-add-select-filter/emp-army-proposed-add-select-filter.component";

@NgModule({
  declarations: [
    EmpArmyProposedSearchComponent,
    EmpArmyProposedIndexComponent,
    EmpArmyProposedAddComponent,
    EmpArmyProposedAdditionalComponent,
    EmpArmyProposedSystemIndexComponent,
    EmpArmyProposedSystemSearchComponent,
    OrgArmyProposedComponent,
    EmpArmyProposedExportComponent,
    empArmyProposedUpdateSignUnit,
    EmpArmyProposedAddSelectFilterComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    EmpArmyProposedRoutingModule,
    AngularMultiSelectModule
  ],
  entryComponents: [
    EmpArmyProposedAddComponent, 
    EmpArmyProposedAdditionalComponent,
    OrgArmyProposedComponent,
    EmpArmyProposedExportComponent,
    empArmyProposedUpdateSignUnit,
  ]
})
export class EmpArmyProposedModule { }
