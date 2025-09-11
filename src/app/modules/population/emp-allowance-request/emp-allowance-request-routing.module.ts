import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    EmpAllowanceRequestIndexComponent
} from "@app/modules/population/emp-allowance-request/emp-allowance-request-index/emp-allowance-request-index.component";
import {EmpAllowanceRequestFormComponent} from "./emp-allowance-request-form/emp-allowance-request-form.component";

const routes: Routes = [
    {
        path: '',
        component: EmpAllowanceRequestIndexComponent
    },
    {
        path: 'create',
        component: EmpAllowanceRequestFormComponent
    },
    {
        path: 'edit/:id',
        component: EmpAllowanceRequestFormComponent
    },
    {
        path: 'edit-by-proposal-approval/:id/:allowanceProposalId',
        component: EmpAllowanceRequestFormComponent
    },
    {
        path: 'view/:id',
        component: EmpAllowanceRequestFormComponent
    },
    {
        path: 'view-by-proposal/:otherId/:id',
        component: EmpAllowanceRequestFormComponent
    },
    {
        path: 'view-by-proposal-sign/:otherId/:id',
        component: EmpAllowanceRequestFormComponent
    },
    {
        path: 'view-by-proposal-approval/:otherId/:id',
        component: EmpAllowanceRequestFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmpAllowanceRequestRoutingModule { }
