import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    AllowanceProposalApprovalRoutingModule
} from "@app/modules/population/allowance-proposal-approval/allowance-proposal-approval-routing.module";
import {
    AllowanceProposalApprovalIndexComponent
} from "@app/modules/population/allowance-proposal-approval/allowance-proposal-approval-index/allowance-proposal-approval-index.component";
import {
    AllowanceProposalApprovalSearchComponent
} from "@app/modules/population/allowance-proposal-approval/allowance-proposal-approval-search/allowance-proposal-approval-search.component";
import {
    AllowanceProposalApprovalFormComponent
} from "@app/modules/population/allowance-proposal-approval/allowance-proposal-approval-form/allowance-proposal-approval-form.component";
import {
    AllowanceProposalReasonCancel
} from "@app/modules/population/allowance-proposal-approval/allowance-proposal-approval-search/allowance-proposal-approval-cancel/allowance-proposal-reason-cancel";


@NgModule({
    declarations: [AllowanceProposalApprovalIndexComponent,
        AllowanceProposalApprovalSearchComponent,
        AllowanceProposalApprovalFormComponent,
        AllowanceProposalReasonCancel],
    imports: [
        CommonModule,
        SharedModule,
        AllowanceProposalApprovalRoutingModule
    ],
    providers: [NgbActiveModal],
    entryComponents: [AllowanceProposalReasonCancel]
})
export class AllowanceProposalApprovalModule { }
