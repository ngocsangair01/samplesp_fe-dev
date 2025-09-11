import { NgModule } from '@angular/core';


import { CategoryService } from '@app/core/services/setting/category.service';
import { CategoryTypeService } from '@app/core/services/setting/category-type.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import {
  PlanWorkManagementRoutingModule
} from "@app/modules/plan-management/plan-work-management/plan-work-management-routing.module";
import {
  PlanWorkFormComponent
} from "@app/modules/plan-management/plan-work-management/plan-work-form/plan-work-form.component";
import {
  PlanWorkSearchComponent
} from "@app/modules/plan-management/plan-work-management/plan-work-search/plan-work-search.component";
import {
  PlanWorkImportComponent
} from "@app/modules/plan-management/plan-work-management/plan-work-import/plan-work-import.component";

@NgModule({
  declarations: [
    PlanWorkFormComponent,
    PlanWorkSearchComponent,
    PlanWorkImportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PlanWorkManagementRoutingModule
  ],
  entryComponents: [],
  providers: [
    CategoryService, CategoryTypeService,
  ]
})
export class PlanWorkManagementModule { }
