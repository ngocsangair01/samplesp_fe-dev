import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmployeeImportComponent} from './import/employee-import.component';
import {
  EmployeeRetiredIndexComponent
} from './employee-retired/employee-retired-index/employee-retired-index.component';
import {
  RetiredInformationFormComponent
} from './employee-retired/retired-information-form/retired-information-form.component';
import {LayoutEmployeeComponent} from './employee-retired/layout-emloyee/layout-emloyee.component';
import {DashboardEmployeeComponent} from "@app/modules/employee/dashboard-employee/dashboard-employee.component";

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardEmployeeComponent,
  },
  {
    path: 'retired',
    component: EmployeeRetiredIndexComponent,
  }, {
    path: 'retired/:warningType',
    component: EmployeeRetiredIndexComponent,
  }, {
    path: 'retired/:id',
    component: LayoutEmployeeComponent,
    children: [
      {
        path: 'edit',
        component: RetiredInformationFormComponent,
      },
      {
        path: 'view',
        component: RetiredInformationFormComponent,
      },
    ]
  },
  {
    path: 'employee-import',
    component: EmployeeImportComponent,
  },
  {
    path: 'army-proposed-template',
    loadChildren: './army-proposed-template/army-proposed-template.module#ArmyProposedTemplateModule'
  },
  {
    path: 'progress-track',
    loadChildren: './progress-track/progress-track.module#ProgressTrackModule'
  }, {
    path: 'task',
    loadChildren: './task/task.module#TaskModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {
}
