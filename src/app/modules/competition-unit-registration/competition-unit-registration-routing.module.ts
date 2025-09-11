import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UnitRegistrationIndexComponent} from "@app/modules/competition-unit-registration/competition-unit-registration-index/competition-unit-registration-index.component";
import {UnitRegistrationCompetitionFormComponent} from "./competition-unit-registration-competition-form/competition-unit-registration-competition-form.component";
import {UnitRegistrationUpdateResultComponent} from "@app/modules/competition-unit-registration/competition-unit-registration-update-result/competition-unit-registration-update-result.component";
const routes: Routes = [
  {
    path: '',
    component: UnitRegistrationIndexComponent
  },
  {
    path: 'view/:id',
    component: UnitRegistrationCompetitionFormComponent
  },
  {
    path: 'edit/:id',
    component: UnitRegistrationCompetitionFormComponent
  },
  {
    path: 'create',
    component: UnitRegistrationCompetitionFormComponent
  },
  {
    path: 'create/:id',
    component: UnitRegistrationCompetitionFormComponent
  },
  {
    path: 'update',
    component: UnitRegistrationUpdateResultComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitRegistrationRoutingModule { }
