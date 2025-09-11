import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrUpdateComponent } from './create-update/create-update.component';
import { IndexComponent } from './index/index.component';
import {
  CreateClassComponent
} from "@app/modules/employee/training-topic/training-class/create-class/create-class.component";
import {ViewClassComponent} from "@app/modules/employee/training-topic/training-class/view-class/view-class.component";
import {
  CreateOrUpdateClassComponent
} from "@app/modules/employee/training-topic/training-class/create-update-class/create-update-class.component";

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'create-update/:id',
    component: CreateOrUpdateComponent
  },
  {
    path: 'create-update',
    component: CreateOrUpdateComponent
  },
  {
    path: 'view/:id',
    component: CreateOrUpdateComponent
  },
  {
    path: 'clone/:id',
    component: CreateOrUpdateComponent
  },
  {
    path: 'quick-deploy/:id',
    component: CreateOrUpdateComponent
  },
  {
    path: 'view-list-class/:id',
    component: ViewClassComponent
  },
  {
    path: 'create-class/:id',
    component: CreateClassComponent
  },
  {
    path: 'create-update-class/:id/:id1',
    component: CreateOrUpdateClassComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingTopicRoutingModule { }
