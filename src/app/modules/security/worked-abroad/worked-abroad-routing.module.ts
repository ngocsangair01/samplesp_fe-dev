import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    WorkedAbroadIndexComponent
} from "@app/modules/security/worked-abroad/worked-abroad-index/worked-abroad-index.component";
import {
    WorkedAbroadFormComponent
} from "@app/modules/security/worked-abroad/worked-abroad-form/worked-abroad-form.component";
import {
    WorkedAbroadImportComponent
} from "@app/modules/security/worked-abroad/worked-abroad-import/worked-abroad-import.component";

const routes: Routes = [
    {
        path: '',
        component: WorkedAbroadIndexComponent,
    },
    {
        path: 'add',
        component: WorkedAbroadFormComponent,
    },
    {
        path: 'edit/:id',
        component: WorkedAbroadFormComponent,
    },
    {
        path: 'import',
        component: WorkedAbroadImportComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WorkedAbroadRoutingModule { }
