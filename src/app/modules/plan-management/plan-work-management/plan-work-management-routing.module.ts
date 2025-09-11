import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  PlanWorkSearchComponent
} from "@app/modules/plan-management/plan-work-management/plan-work-search/plan-work-search.component";
import {
  PersonalPunishmentFormComponent
} from "@app/modules/monitoring/personal-punishment-managerment/personal-punishment-form/personal-punishment-form.component";
import {
  PlanWorkFormComponent
} from "@app/modules/plan-management/plan-work-management/plan-work-form/plan-work-form.component";

const routes: Routes = [
  {
    path: '',
    component: PlanWorkSearchComponent,
  },
  {
    path: "add",
    component: PlanWorkFormComponent
  },
  {
    path: "edit/:id",
    component: PlanWorkFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanWorkManagementRoutingModule { }
