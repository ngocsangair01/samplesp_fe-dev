import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { CreateOrUpdateComponent } from './create-update/create-update.component';
import { IndexComponent } from './index/index.component';
import { UpdateProgressCompoment } from './index/update-progress.component';
import { TaskRoutingModule } from './task-routing.module';


@NgModule({
  declarations: [CreateOrUpdateComponent, IndexComponent, UpdateProgressCompoment],
  imports: [
    CommonModule,
    SharedModule,
    TaskRoutingModule,
  ],
  entryComponents: [UpdateProgressCompoment]
})
export class TaskModule { }
