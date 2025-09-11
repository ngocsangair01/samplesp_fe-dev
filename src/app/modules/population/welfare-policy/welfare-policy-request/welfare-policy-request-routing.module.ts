import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelfarePolicyRequestComponent } from './welfare-policy-request-index/welfare-policy-request-index.component';
import { WelfarePolicyRequestFormComponent } from './welfare-policy-request-form/welfare-policy-request-form.component';

const routes: Routes = [
  {
    path: '',
    component: WelfarePolicyRequestComponent
  },
  {
    path: 'create',
    component: WelfarePolicyRequestFormComponent
  },
  {
    path: 'update/:id',
    component: WelfarePolicyRequestFormComponent
  },
  {
    path: 'view/:id',
    component: WelfarePolicyRequestFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelfarePolicyRequestRoutingModule { }
