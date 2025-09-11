import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssessmentPeriodIndexComponent } from './assessment-period-index/assessment-period-index.component';
import { AssessmentPeriodFormComponent } from './assessment-period-form/assessment-period-form.component';
import {
  AssessmentMemberFormComponent
} from "@app/modules/employee/staff-assessment/assessment-period/assessment-member-form/assessment-member-form.component";

const routes: Routes = [
  {
    path: 'assessment-period',
    component: AssessmentPeriodIndexComponent,
  }, {
    path: 'assessment-period/add',
    component: AssessmentPeriodFormComponent,
  }, {
    path: 'assessment-period/edit/:id',
    component: AssessmentPeriodFormComponent,
  },{
    path: 'assessment-period/view/:id',
    component: AssessmentPeriodFormComponent,
  }, {
    path: 'assessment-period/member',
    component: AssessmentMemberFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentPeriodRoutingModule { }
