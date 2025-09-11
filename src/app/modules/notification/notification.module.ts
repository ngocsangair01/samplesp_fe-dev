import { NotificationSearchComponent } from './notification-search/notification-search.component';
import { NotificationRoutingModule } from './notification-routing.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared';
import { NotificationAddComponent } from './notification-add/notification-add.component';
import { NotificationViewComponent } from './notification-view/notification-view.component';
import { NotificationIndexComponent } from './notification-index/notification-index.component';
import { NotificationRequestComponent } from './notification-request/notification-request.component';

@NgModule({
  declarations: [
    NotificationSearchComponent,
    NotificationAddComponent,
    NotificationViewComponent,
    NotificationIndexComponent,
    NotificationRequestComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    NotificationRoutingModule
  ],
  entryComponents: [NotificationAddComponent, NotificationRequestComponent]
})
export class NotificationModule { }
