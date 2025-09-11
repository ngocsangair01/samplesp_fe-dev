import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { CreateOrUpdateComponent } from './create-update/create-update.component';
import { SendReminderModaComponent } from './create-update/modal/send-reminder-modal.component';
import { TestHistoryModaComponent } from './create-update/modal/test-history-modal.component';
import { UnconfirmedEmployeeListComponent } from './create-update/modal/unconfirmed-employee-list.component';
import { IndexComponent } from './index/index.component';
import { ProgressTrackRoutingModule } from './progress-track-routing.module';


@NgModule({
  declarations: [CreateOrUpdateComponent, IndexComponent, TestHistoryModaComponent, UnconfirmedEmployeeListComponent, SendReminderModaComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProgressTrackRoutingModule,
  ],
  entryComponents: [TestHistoryModaComponent, SendReminderModaComponent]
})
export class ProgressTrackModule { }
