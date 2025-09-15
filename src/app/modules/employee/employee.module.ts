import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeImportComponent } from './import/employee-import.component';
import { ChartModule } from 'primeng/primeng';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown'
import { EmployeeRetiredIndexComponent } from './employee-retired/employee-retired-index/employee-retired-index.component';
import { EmployeeRetiredSearchComponent } from './employee-retired/employee-retired-search/employee-retired-search.component';
import { RetiredInformationFormComponent } from './employee-retired/retired-information-form/retired-information-form.component';
import { LayoutEmployeeComponent } from './employee-retired/layout-emloyee/layout-emloyee.component';
import { EmpInfoRetiredComponent } from './employee-retired/layout-emloyee/emp-info/emp-info.component';
import { DashboardEmployeeComponent } from './dashboard-employee/dashboard-employee.component';
import {
  RetiredImportModalComponent
} from "@app/modules/employee/employee-retired/retired-import-modal/retired-import-modal.component";
@NgModule({
  declarations: [
    EmployeeImportComponent,
    EmployeeRetiredIndexComponent,
    EmployeeRetiredSearchComponent,
    RetiredInformationFormComponent,
    LayoutEmployeeComponent,
    EmpInfoRetiredComponent,
    DashboardEmployeeComponent,
    RetiredImportModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EmployeeRoutingModule,
    ChartModule,
    AngularMultiSelectModule
  ],
  exports: [
  ],
  entryComponents: [
    RetiredImportModalComponent
  ],
})
export class EmployeeModule {
}
