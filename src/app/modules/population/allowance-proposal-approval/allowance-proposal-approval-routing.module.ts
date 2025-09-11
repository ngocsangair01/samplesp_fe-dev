import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    AllowanceProposalApprovalIndexComponent
} from "@app/modules/population/allowance-proposal-approval/allowance-proposal-approval-index/allowance-proposal-approval-index.component";
import {
    AllowanceProposalApprovalFormComponent
} from "@app/modules/population/allowance-proposal-approval/allowance-proposal-approval-form/allowance-proposal-approval-form.component";

const routes: Routes = [
    {
        path: '',
        component: AllowanceProposalApprovalIndexComponent
    },
    {
        path: 'create',
        component: AllowanceProposalApprovalFormComponent
    },
    {
        path: 'edit/:id',
        component: AllowanceProposalApprovalFormComponent
    },
    {
        path: 'view/:id',
        component: AllowanceProposalApprovalFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AllowanceProposalApprovalRoutingModule { }
