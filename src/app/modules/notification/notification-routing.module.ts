import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationAddComponent } from './notification-add/notification-add.component';
import { NotificationViewComponent } from './notification-view/notification-view.component';
import { NotificationIndexComponent } from './notification-index/notification-index.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationIndexComponent,
  },{
    path: 'notification-edit/:id',
    component: NotificationAddComponent,
  },{
    path: 'notification-add',
    component: NotificationAddComponent,
  },{
    path: 'notification-view/:id',
    component: NotificationViewComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule {}

