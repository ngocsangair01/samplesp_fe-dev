import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentIndexComponent } from './assessment-index/assessment-index.component';

const routes: Routes = [
  {
    path: '',
    component: AssessmentIndexComponent,
  },{
    path: 'detail/:assessmentPeriodId',
    component: AssessmentIndexComponent,
  },
  {
    path: 'detail/:assessmentPeriodId/:employeeId',
    component: AssessmentIndexComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentRoutingModule {
}