import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    RelativeAbroadIndexComponent
} from "@app/modules/security/relative-abroad/relative-abroad-index/relative-abroad-index.component";
import {
    RelativeAbroadFormComponent
} from "@app/modules/security/relative-abroad/relative-abroad-form/relative-abroad-form.component";
import {
    RelativeAbroadImportComponent
} from "@app/modules/security/relative-abroad/relative-abroad-import/relative-abroad-import.component";

const routes: Routes = [
    {
        path: '',
        component: RelativeAbroadIndexComponent,
    },
    {
        path: 'add',
        component: RelativeAbroadFormComponent,
    },
    {
        path: 'edit/:id',
        component: RelativeAbroadFormComponent,
    },
    {
        path: 'import',
        component: RelativeAbroadImportComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RelativeAbroadRoutingModule { }
