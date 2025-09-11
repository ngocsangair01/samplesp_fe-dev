import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudyAbroadIndexComponent } from './study-abroad-index/study-abroad-index.component';
import { StudyAbroadImportComponent } from './study-abroad-import/study-abroad-import.component';
import {
  StudyAbroadFormComponent
} from "@app/modules/security/study-abroad/study-abroad-form/study-abroad-form.component";

const routes: Routes = [
  {
    path: '',
    component: StudyAbroadIndexComponent,
  },
  {
    path: 'add',
    component: StudyAbroadFormComponent,
  },
  {
    path: 'edit/:id',
    component: StudyAbroadFormComponent,
  },
  {
    path: 'import',
    component: StudyAbroadImportComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyAbroadRoutingModule { }
