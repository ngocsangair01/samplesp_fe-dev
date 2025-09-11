import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertyResolver } from '@app/shared/services/property.resolver';
import { CreateWarningComponent } from './warning-manager-add/create-warning.component';
import { SearchWarningComponent } from './warning-manager-search/search-warning.component';

const routes: Routes = [
  {
    path: '',
    component: SearchWarningComponent
  },
  {
    path: 'add',
    component: CreateWarningComponent,
    data: {
          resource: "WARNING_MANAGER",
        }
  }, {
    path: 'edit/:warningManagerId',
    component: CreateWarningComponent,
    resolve: {
      props: PropertyResolver
    },
    data: {
      resource: "WARNING_MANAGER",
    }
  },{
    path: 'view/:warningManagerId',
    component: CreateWarningComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarningRoutingModule{}
