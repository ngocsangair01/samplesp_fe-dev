import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DocumentTypeFormComponent} from './document-type/document-type-form/document-type-form.component';
import {DocumentFormComponent} from './document/document-form/document-form.component';
import {DocumentTypeIndexComponent} from './document-type/document-type-index/document-type-index.component';
import {DocumentIndexComponent} from './document/document-index/document-index.component';
import {DashboardDocumentComponent} from "@app/modules/document/dashboard-document/dashboard-document.component";

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardDocumentComponent,
    }, {
        path: 'document-type',
        component: DocumentTypeIndexComponent,
    },
    {
        path: 'document',
        component: DocumentIndexComponent,
    },
    {
        path: 'document-type-add',
        component: DocumentTypeFormComponent,
    }
    , {
        path: 'document-view/:id/:view',
        component: DocumentFormComponent,
    }, {
        path: 'document-type-edit/:id',
        component: DocumentTypeFormComponent,
    },
    {
        path: 'document-add',
        component: DocumentFormComponent,
    }
    , {
        path: 'document-edit/:id',
        component: DocumentFormComponent,
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentRoutingModule {
}
