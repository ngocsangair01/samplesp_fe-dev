import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudyAbroadRoutingModule } from './study-abroad-routing.module';
import { StudyAbroadIndexComponent } from './study-abroad-index/study-abroad-index.component';
import { StudyAbroadSearchComponent } from './study-abroad-search/study-abroad-search.component';
import { StudyAbroadImportComponent } from './study-abroad-import/study-abroad-import.component';
import { SharedModule } from '@app/shared';
import {
  StudyAbroadFormComponent
} from "@app/modules/security/study-abroad/study-abroad-form/study-abroad-form.component";

@NgModule({
  declarations: [
    StudyAbroadIndexComponent,
    StudyAbroadSearchComponent,
    StudyAbroadImportComponent,
    StudyAbroadFormComponent],
  imports: [
    SharedModule,
    CommonModule,
    StudyAbroadRoutingModule
  ]
})
export class StudyAbroadModule { }
