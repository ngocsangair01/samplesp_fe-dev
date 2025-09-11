import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    AllowanceProposalIndexComponent
} from "@app/modules/population/allowance-proposal/allowance-proposal-index/allowance-proposal-index.component";
import {
    AllowanceProposalFormComponent
} from "@app/modules/population/allowance-proposal/allowance-proposal-form/allowance-proposal-form.component";

const routes: Routes = [
    {
        path: '',
        component: AllowanceProposalIndexComponent
    },
    {
        path: 'create',
        component: AllowanceProposalFormComponent
    },
    {
        path: 'edit/:id',
        component: AllowanceProposalFormComponent
    },
    {
        path: 'view/:id',
        component: AllowanceProposalFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AllowanceProposalRoutingModule { }
