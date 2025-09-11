import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { CreateOrUpdateComponent } from './create-update/create-update.component';
import { IndexComponent } from './index/index.component';
import { TrainingTopicRoutingModule } from './training-topic-routing.module';
import {
  ImportClassMemberFormComponent
} from "@app/modules/employee/training-topic/create-update/import-form/import-class-member-form.component";
import {
  FileImportPopupComponent
} from "@app/modules/employee/training-topic/create-update/file-import-popup/file-import-popup.component";
import {
  CreateClassComponent
} from "@app/modules/employee/training-topic/training-class/create-class/create-class.component";
import {
  ViewClassComponent
} from "@app/modules/employee/training-topic/training-class/view-class/view-class.component";
import {
  ImportResultClassModalComponent
} from "@app/modules/employee/training-topic/training-class/import-result-class-modal/import-result-class-modal.component";
import {
  CreateOrUpdateClassComponent
} from "@app/modules/employee/training-topic/training-class/create-update-class/create-update-class.component";



@NgModule({
  declarations: [CreateOrUpdateComponent, IndexComponent, ImportClassMemberFormComponent, FileImportPopupComponent, CreateClassComponent,CreateOrUpdateClassComponent, ViewClassComponent, ImportResultClassModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    TrainingTopicRoutingModule,

  ],    entryComponents: [FileImportPopupComponent, ViewClassComponent,CreateOrUpdateClassComponent, ImportResultClassModalComponent]
})
export class TrainingTopicModule { }
