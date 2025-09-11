
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppParamsComponent } from './app-params/app-params.component';



const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    component: AppParamsComponent,
  },
  // {
  //   path: 'view/:id/:view',
  //   component: TemplateNotifyFormComponent,
  // },
  // {
  //   path: 'add',
  //   component: TemplateNotifyFormComponent,
  // }
  // ,{
  //   path: 'edit/:id',
  //   component: TemplateNotifyFormComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],    
  exports: [RouterModule]
})
export class AppParamsRoutingModule { }   
