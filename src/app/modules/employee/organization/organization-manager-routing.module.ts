import { OrganizationManagerSearchComponent } from './organization-manager-search/organization-manager-search.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationManagerComponent } from './organization-manager.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationManagerComponent,
    children: [
        {
          path: '',
          component: OrganizationManagerSearchComponent
        },
        {
          path: 'search/:id',
          component: OrganizationManagerSearchComponent
        }
      ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationManagerRoutingModule {}
