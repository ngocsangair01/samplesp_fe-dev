
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateNotifyFormComponent } from './template-notify-form/template-notify-form.component';
import { TemplateNotifyIndexComponent } from './template-notify-index/template-notify-index.component';



const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    component: TemplateNotifyIndexComponent,
  },
  {
    path: 'view/:id/:view',
    component: TemplateNotifyFormComponent,
  },
  {
    path: 'add',
    component: TemplateNotifyFormComponent,
  }
  ,{
    path: 'edit/:id',
    component: TemplateNotifyFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],    
  exports: [RouterModule]
})
export class TemplateNotifyRoutingModule { }   
