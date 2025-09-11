import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendNotificationComponent } from './send-notification/send-notification.component';

const routes: Routes = [
  {
    path: '',
    component: SendNotificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendNotificationRoutingModule { }
