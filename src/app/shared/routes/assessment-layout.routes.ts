import { Routes } from '@angular/router';

export const ASSESSMENT_ROUTES: Routes = [
  {
    path: 'assessment',
    loadChildren: './modules/employee/staff-assessment/assessment/assessment.module#AssessmentModule'
  }
]