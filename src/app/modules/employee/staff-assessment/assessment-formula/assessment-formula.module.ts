import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { AssessmentFormulaRoutingModule } from './assessment-formula-routing.module';
import { AssessmentFormulaSearchComponent } from './assessment-formula-search/assessment-formula-search.component';
import { AssessmentFormulaIndexComponent } from './assessment-formula-index/assessment-formula-index.component';
import { AssessmentFormulaFormComponent } from './assessment-formula-form/assessment-formula-form.component';

@NgModule({
  declarations: [
    AssessmentFormulaSearchComponent,
    AssessmentFormulaIndexComponent,
    AssessmentFormulaFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AssessmentFormulaRoutingModule
  ]
})
export class AssessmentFormulaModule { }
