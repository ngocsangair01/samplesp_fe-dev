import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommitToComplyTetRoutingModule } from './commit-to-comply-tet-routing.module';
import { CommitToComplyTetIndexComponent } from './commit-to-comply-tet-index/commit-to-comply-tet-index.component';
import { CommitToComplyTetSearchComponent } from './commit-to-comply-tet-search/commit-to-comply-tet-search.component';
import {SharedModule} from "@app/shared";
import { CommitToComplyTetFormComponent } from "./commit-to-comply-tet-form/commit-to-comply-tet-form.component";
import {
  CommitToComplyTetFormSendComponent
} from "@app/modules/commit-to-comply-tet/commit-to-comply-tet-form-send/commit-to-comply-tet-form-send.component";

@NgModule({
  declarations: [CommitToComplyTetIndexComponent, CommitToComplyTetSearchComponent, CommitToComplyTetFormComponent, CommitToComplyTetFormSendComponent],
  imports: [
    CommonModule,
    CommitToComplyTetRoutingModule,
    SharedModule
  ],
  entryComponents: [
    CommitToComplyTetFormSendComponent,
  ]
})
export class CommitToComplyTetModule { }
