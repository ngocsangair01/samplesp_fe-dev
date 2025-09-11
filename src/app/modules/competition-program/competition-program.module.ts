import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompetitionProgramRoutingModule } from './competition-program-routing.module';
import { CompetitionProgramIndexComponent } from './competition-program-index/competition-program-index.component';
import { CompetitionProgramSearchComponent } from './competition-program-search/competition-program-search.component';
import {SharedModule} from "@app/shared";
import { CompetitionProgramFormComponent } from "./competition-program-form/competition-program-form.component";
import {CompetitionProgramFormSendComponent} from "@app/modules/competition-program/competition-program-form-send/competition-program-form-send.component";

@NgModule({
  declarations: [CompetitionProgramIndexComponent, CompetitionProgramSearchComponent, CompetitionProgramFormComponent, CompetitionProgramFormSendComponent],
  imports: [
    CommonModule,
    CompetitionProgramRoutingModule,
    SharedModule
  ],
  entryComponents: [
    CompetitionProgramFormSendComponent,
  ]
})
export class CompetitionProgramModule { }
