import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    AllowanceProposalSignIndexComponent
} from "@app/modules/population/allowance-proposal-sign/allowance-proposal-sign-index/allowance-proposal-sign-index.component";
import {
    AllowanceProposalSignFormComponent
} from "@app/modules/population/allowance-proposal-sign/allowance-proposal-sign-form/allowance-proposal-sign-form.component";

const routes: Routes = [
    {
        path: '',
        component: AllowanceProposalSignIndexComponent
    },
    {
        path: 'create',
        component: AllowanceProposalSignFormComponent
    },
    {
        path: 'edit/:id',
        component: AllowanceProposalSignFormComponent
    },
    {
        path: 'view/:id',
        component: AllowanceProposalSignFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AllowanceProposalSignRoutingModule { }
