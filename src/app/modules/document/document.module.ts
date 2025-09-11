import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@app/shared';
import {DocumentRoutingModule} from './document-routing.module';
import {DocumentTypeSearchComponent} from './document-type/document-type-search.component';
import {DocumentSearchComponent} from './document/document-search.component';
import {DocumentTypeFormComponent} from './document-type/document-type-form/document-type-form.component';
import {DocumentFormComponent} from './document/document-form/document-form.component';
import {DocumentIndexComponent} from './document/document-index/document-index.component';
import {DocumentTypeIndexComponent} from './document-type/document-type-index/document-type-index.component';
import {DashboardDocumentComponent} from './dashboard-document/dashboard-document.component';


@NgModule({
  declarations: [
    DocumentTypeSearchComponent,
    DocumentSearchComponent,
    DocumentTypeFormComponent,
    DocumentFormComponent,
    DocumentIndexComponent,
    DocumentTypeIndexComponent,
    DashboardDocumentComponent,
     ],    
  imports: [
    CommonModule,
    SharedModule,
    DocumentRoutingModule
  ],
  exports: [
  ],
  entryComponents: []
})
export class DocumentModule {
}
