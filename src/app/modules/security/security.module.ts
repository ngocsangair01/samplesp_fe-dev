import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { FileListIndexComponent } from './file-list/file-list-index/file-list-index.component';
import { FileListSearchComponent } from './file-list/file-list-search/file-list-search.component';
import { PoliticsQualityFormComponent } from './politics-quality/politics-quality-form/politics-quality-form.component';
import { PoliticsQualityImportComponent } from './politics-quality/politics-quality-import/politics-quality-import.component';
import { PoliticsQualityIndexComponent } from './politics-quality/politics-quality-index/politics-quality-index.component';
import { PoliticsQualitySearchComponent } from './politics-quality/politics-quality-search/politics-quality-search.component';
import { KeyProjectConfirmComponent } from './projects-list/key-project-confirm/key-project-confirm.component';
import { KeyProjectFormComponent } from './projects-list/key-project-form/key-project-form.component';
import { KeyProjectIndexComponent } from './projects-list/key-project-index/key-project-index.component';
import { KeyProjectSearchComponent } from './projects-list/key-project-search/key-project-search.component';
import { RedirectSecurityComponent } from './redirect-security/redirect-security.component';
import { ReportQualityInternalComponent } from './report-quality-internal/report-quality-internal.component';
import { ReportWarningSecurityComponent } from './report-security/report-warning-security/report-warning-security.component';
import { SecurityPermissionIndexComponent } from './security-permission/security-permission-index/security-permission-index.component';
import { SecurityPermissionSearchComponent } from './security-permission/security-permission-search/security-permission-search.component';
import { SecurityRoutingModule } from './security-routing.module';
import {
  PersonnelKeyIndexComponent
} from "@app/modules/security/personnel-key/personnel-key-index/personnel-key-index.component";
import {
  PersonnelKeySearchComponent
} from "@app/modules/security/personnel-key/personnel-key-search/personnel-key-search.component";
import {
  PersonnelKeyImportComponent
} from "@app/modules/security/personnel-key/personnel-key-import/personnel-key-import.component";
import {
  PersonnelKeyFormComponent
} from "@app/modules/security/personnel-key/personnel-key-form/personnel-key-form.component";
import { DashboardSecurityComponent } from './dashboard-security/dashboard-security.component';

@NgModule({
  declarations: [
    RedirectSecurityComponent,
    ReportQualityInternalComponent,
    FileListSearchComponent,
    FileListIndexComponent,
    PoliticsQualityIndexComponent,
    PoliticsQualitySearchComponent,
    PoliticsQualityImportComponent,
    KeyProjectIndexComponent,
    KeyProjectSearchComponent,
    KeyProjectFormComponent,
    SecurityPermissionIndexComponent,
    SecurityPermissionSearchComponent,
    ReportWarningSecurityComponent,
    KeyProjectConfirmComponent,
    PoliticsQualityFormComponent,
    PersonnelKeyIndexComponent,
    PersonnelKeySearchComponent,
    PersonnelKeyImportComponent,
    PersonnelKeyFormComponent,
    DashboardSecurityComponent
  ],
  imports: [
    SharedModule,
    SecurityRoutingModule
  ],
  entryComponents: [
    KeyProjectConfirmComponent,
    PoliticsQualityFormComponent
  ]
})
export class SecurityModule { }
