import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementVerticalFormComponent } from './management-vertical-form/management-vertical-form.component';
import { ManagementVerticalImportComponent } from './management-vertical-import/management-vertical-import.component';
import { ManagementVerticalIndexComponent } from './management-vertical-index/management-vertical-index.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementVerticalIndexComponent,
  },
  {
    path: 'import',
    component: ManagementVerticalImportComponent,
  },
  {
    path: 'add',
    component: ManagementVerticalFormComponent,
  },
  {
    path: 'edit/:id',
    component: ManagementVerticalFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementVerticalRoutingModule { }
