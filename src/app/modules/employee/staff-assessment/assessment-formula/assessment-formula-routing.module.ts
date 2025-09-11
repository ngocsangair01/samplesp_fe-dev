import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssessmentFormulaIndexComponent } from './assessment-formula-index/assessment-formula-index.component';
import { AssessmentFormulaFormComponent } from './assessment-formula-form/assessment-formula-form.component';

const routes: Routes = [
  {
    path: '',
    component: AssessmentFormulaIndexComponent,
  },
  {
    path: 'add',
    component: AssessmentFormulaFormComponent
  },
  {
    path: 'edit/:assessmentFormulaId',
    component: AssessmentFormulaFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentFormulaRoutingModule {}

