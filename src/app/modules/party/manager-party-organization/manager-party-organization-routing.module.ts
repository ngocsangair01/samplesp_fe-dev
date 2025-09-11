import { ManagerPartyOrganizationComponent } from './manager-party-organization.component';
import { ManagerPartyOrgSearchComponent } from './manager-party-org-search/manager-party-org-search.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerPartyOrgFormComponent } from './manager-party-org-form/manager-party-org-form.component';
import { ManagerPartyOrgViewComponent } from './manager-party-org-view/manager-party-org-view.component';
import { ManagerPartyOrgTerminationComponent } from './manager-party-org-termination/manager-party-org-termination.component';
import { OrgTreeTerminateComponent } from './org-tree-terminate.component';

const routes: Routes = [
  {
    path: 'termination',
    component: OrgTreeTerminateComponent,
    children: [
        {
          path: '',
          component: ManagerPartyOrgTerminationComponent
        },
        {
          path: 'search/:id',
          component: ManagerPartyOrgTerminationComponent
        }
      ]
  },
  {
    path: '',
    component: ManagerPartyOrganizationComponent,
    children: [
        {
          path: '',
          component: ManagerPartyOrgSearchComponent
        },
        {
          path: 'search/:id',
          component: ManagerPartyOrgSearchComponent
        }, {
           path: 'edit/:id',
           component: ManagerPartyOrgFormComponent,
         },{
           path: 'add',
           component: ManagerPartyOrgFormComponent,
        },{
           path: 'view/:id',
          component: ManagerPartyOrgViewComponent,
        }
      ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManagerPartyOrganizationRoutingModule {}
