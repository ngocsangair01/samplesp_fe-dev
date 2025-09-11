import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransferEmployeeIndexComponent } from './transfer-employee-index/transfer-employee-index.component';
import { TransferEmployeeFormComponent } from './transfer-employee-form/transfer-employee-form.component';
import { TransferEmployeeEvaluateComponent } from './transfer-employee-evaluate/transfer-employee-evaluate.component';

const routes: Routes = [
  {
    path: 'transfer-employee',
    component: TransferEmployeeIndexComponent,
  },
  {
    path: 'transfer-employee-add',
    component: TransferEmployeeFormComponent,
  },
  {
    path: 'transfer-employee-edit/:id',
    component: TransferEmployeeFormComponent,
  },
  {
    path: 'transfer-employee-evaluate/:id',
    component: TransferEmployeeEvaluateComponent,
  },
  {
    path: 'transfer-employee-view/:id',
    component: TransferEmployeeEvaluateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferEmployeeRoutingModule { }
