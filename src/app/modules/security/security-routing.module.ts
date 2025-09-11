
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedirectSecurityComponent } from './redirect-security/redirect-security.component';
import { ReportQualityInternalComponent } from './report-quality-internal/report-quality-internal.component';
import { FileListSearchComponent } from './file-list/file-list-search/file-list-search.component';
import { PoliticsQualityIndexComponent } from './politics-quality/politics-quality-index/politics-quality-index.component';
import { PoliticsQualityImportComponent } from './politics-quality/politics-quality-import/politics-quality-import.component';
import { PersonnelInvolvedIndexComponent } from './personnel-involved/personnel-involved-index/personnel-involved-index.component';
import { PersonnelInvolvedImportComponent } from './personnel-involved/personnel-involved-import/personnel-involved-import.component';
import { KeyProjectIndexComponent } from './projects-list/key-project-index/key-project-index.component';
import { KeyProjectFormComponent } from './projects-list/key-project-form/key-project-form.component';
import { SecurityPermissionIndexComponent } from './security-permission/security-permission-index/security-permission-index.component';
import { ReportWarningSecurityComponent } from './report-security/report-warning-security/report-warning-security.component';
import {
  PersonnelKeyIndexComponent
} from "@app/modules/security/personnel-key/personnel-key-index/personnel-key-index.component";
import {
  PersonnelKeyFormComponent
} from "@app/modules/security/personnel-key/personnel-key-form/personnel-key-form.component";
import {
  PersonnelKeyImportComponent
} from "@app/modules/security/personnel-key/personnel-key-import/personnel-key-import.component";
import {DashboardSecurityComponent} from "@app/modules/security/dashboard-security/dashboard-security.component";

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardSecurityComponent,
  },
  {
    path: 'files',
    component: FileListSearchComponent,
  },
  {
    path: 'report-quality-internal',
    component: ReportQualityInternalComponent,
  }, {
    path: 'politics-quality',
    component: PoliticsQualityIndexComponent,
  },{
    path: 'personnel-key',
    component: PersonnelKeyIndexComponent,
  },{
    path: 'personnel-key-form',
    component: PersonnelKeyFormComponent,
  },{
    path: 'personnel-key-import',
    component: PersonnelKeyImportComponent,
  }, {
    path: 'politics-quality-import',
    component: PoliticsQualityImportComponent,
  },
  {
    path: 'key-projects/personnel-involved',
    loadChildren: './personnel-involved/personnel-involved.module#PersonnelInvolvedModule',
  },
  {
    path: 'key-projects/personnel-involved/:warningType',
    loadChildren: './personnel-involved/personnel-involved.module#PersonnelInvolvedModule',
  },
  {
    path: 'key-projects',
    component: KeyProjectIndexComponent,
  },
  {
    path: 'key-projects/:warningType',
    component: KeyProjectIndexComponent,
  },
  {
    path: 'key-project/add',
    component: KeyProjectFormComponent,
  },
  {
    path: 'key-project/edit/:id',
    component: KeyProjectFormComponent,
  },
  {
    path: 'key-project/view/:id',
    component: KeyProjectFormComponent,
  },
  {
    path: 'security-protection-warning',
    component: ReportWarningSecurityComponent,
  },
  {
    path: 'management-vertical',
    loadChildren: './management-vertical/management-vertical.module#ManagementVerticalModule',
  },
  {
    path: 'permisstion',
    component: SecurityPermissionIndexComponent,
  },
  {
    path: 'study-abroad',
    loadChildren: './study-abroad/study-abroad.module#StudyAbroadModule',
  },
  {
    path: 'worked-abroad',
    loadChildren: './worked-abroad/worked-abroad.module#WorkedAbroadModule',
  },
  {
    path: 'relative-abroad',
    loadChildren: './relative-abroad/relative-abroad.module#RelativeAbroadModule',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
