import { EmailSmsDynamicIndexComponent } from './email-sms-dynamic-index/email-sms-dynamic-index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: EmailSmsDynamicIndexComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailSmsDynamicRoutingModule { }
