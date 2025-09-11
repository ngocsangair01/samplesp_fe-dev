import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendNotificationRoutingModule } from './send-notification-routing.module';
import { SharedModule } from '@app/shared';
import { SendNotificationComponent } from './send-notification/send-notification.component';


@NgModule({
  declarations: [SendNotificationComponent],
  imports: [
    CommonModule,
    SharedModule,
    SendNotificationRoutingModule
  ]
})
export class SendNotificationModule { }
