import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestPolicyProgramIndexComponent } from './request-policy-program/request-policy-program-index/request-policy-program-index.component';
import { ResponsePolicyProgramIndexComponent } from './response-policy-program/response-policy-program-index/response-policy-program-index.component';
import { RequestPolicyProgramFormComponent } from './request-policy-program/request-policy-program-form/request-policy-program-form.component';
import { ImportResponsePolicyProgramIndexComponent } from './import-response-policy-program/import-response-policy-program-index/import-response-policy-program-index.component';
import { PolicyManagementComponent } from './policy-management/policy-management.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/policy-program',
    pathMatch: 'full'
  },{
    path: 'request-policy-program',
    component: RequestPolicyProgramIndexComponent,  
  },{
    path: 'request-policy-program-add',
    component: RequestPolicyProgramFormComponent,  
  },{
    path: 'request-policy-program-edit/:id',
    component: RequestPolicyProgramFormComponent,  
  },{
    path: 'request-policy-program-view/:id',
    component: RequestPolicyProgramFormComponent,  
  },{
    path: 'response-policy-program',
    component: ResponsePolicyProgramIndexComponent,  
  },{
    path: 'import-response-policy-program/:id',
    component: ImportResponsePolicyProgramIndexComponent,
  },{
    path: 'policy-management',
    component: PolicyManagementComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyProgramRoutingModule { }
