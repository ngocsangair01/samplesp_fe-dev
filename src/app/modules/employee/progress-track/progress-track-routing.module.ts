import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrUpdateComponent } from './create-update/create-update.component';
import { UnconfirmedEmployeeListComponent } from './create-update/modal/unconfirmed-employee-list.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'view',
    component: CreateOrUpdateComponent
  },
  {
    path: 'unconfirmed-list',
    component: UnconfirmedEmployeeListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgressTrackRoutingModule { }
