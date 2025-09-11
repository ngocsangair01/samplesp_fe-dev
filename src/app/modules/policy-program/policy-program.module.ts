import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { PolicyProgramRoutingModule } from './policy-program-routing.module';
import { TreeTableModule } from 'primeng/primeng';
import { RequestPolicyProgramIndexComponent } from './request-policy-program/request-policy-program-index/request-policy-program-index.component';
import { RequestPolicyProgramSearchComponent } from './request-policy-program/request-policy-program-search/request-policy-program-search.component';
import { RequestPolicyProgramFormComponent } from './request-policy-program/request-policy-program-form/request-policy-program-form.component';
import { ResponsePolicyProgramFormComponent } from './response-policy-program/response-policy-program-form/response-policy-program-form.component';
import { ResponsePolicyProgramIndexComponent } from './response-policy-program/response-policy-program-index/response-policy-program-index.component';
import { ResponsePolicyProgramSearchComponent } from './response-policy-program/response-policy-program-search/response-policy-program-search.component';
import { PolicyOrgTreeSelectorComponent } from './policy-org-tree-selector/policy-org-tree-selector.component';
import { ImportResponsePolicyProgramIndexComponent } from './import-response-policy-program/import-response-policy-program-index/import-response-policy-program-index.component';
import { ImportResponsePolicyProgramInfoComponent } from './import-response-policy-program/import-response-policy-program-info/import-response-policy-program-info.component';
import { ImportResponsePolicyProgramAddComponent } from './import-response-policy-program/import-response-policy-program-add/import-response-policy-program-add.component';
import { ImportResponsePolicyProgramImportComponent } from './import-response-policy-program/import-response-policy-program-import/import-response-policy-program-import.component';
import { PolicyManagementComponent } from './policy-management/policy-management.component';

@NgModule({
  declarations: [
        RequestPolicyProgramIndexComponent,
        RequestPolicyProgramSearchComponent,
        RequestPolicyProgramFormComponent,
        ResponsePolicyProgramFormComponent,
        ResponsePolicyProgramIndexComponent,
        ResponsePolicyProgramSearchComponent,
        PolicyOrgTreeSelectorComponent,
        ImportResponsePolicyProgramIndexComponent,
        ImportResponsePolicyProgramInfoComponent,
        ImportResponsePolicyProgramAddComponent,
        ImportResponsePolicyProgramImportComponent,
        PolicyManagementComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PolicyProgramRoutingModule,
    TreeTableModule
  ],
  entryComponents:[  
    ImportResponsePolicyProgramAddComponent,
    ImportResponsePolicyProgramImportComponent,],
})
export class PolicyProgramModule { }
