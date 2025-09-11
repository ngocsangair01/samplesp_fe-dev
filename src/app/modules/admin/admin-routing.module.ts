
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: '/home-page',
    pathMatch: 'full'
  },
  {
    path: 'template-notify',
    loadChildren: './template-notify/template-notify.module#TemplateNotifyModule'
  },
  {
    path: 'app-params',
    loadChildren: './app-params/app-params.module#AppParamsModule'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],    
  exports: [RouterModule]
})
export class AdminRoutingModule { }   
