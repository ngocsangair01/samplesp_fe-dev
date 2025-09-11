import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    AllowanceProposalSignRoutingModule
} from "@app/modules/population/allowance-proposal-sign/allowance-proposal-sign-routing.module";
import {
    AllowanceProposalSignIndexComponent
} from "@app/modules/population/allowance-proposal-sign/allowance-proposal-sign-index/allowance-proposal-sign-index.component";
import {
    AllowanceProposalSignSearchComponent
} from "@app/modules/population/allowance-proposal-sign/allowance-proposal-sign-search/allowance-proposal-sign-search.component";
import {
    AllowanceProposalSignFormComponent
} from "@app/modules/population/allowance-proposal-sign/allowance-proposal-sign-form/allowance-proposal-sign-form.component";
import {
    AllowanceProposalSignFormPopupComponent
} from "@app/modules/population/allowance-proposal-sign/allowance-proposal-sign-form/allowance-proposal-sign-form-popup/allowance-proposal-sign-form-popup.component";


import { AllowanceProposalErrorComponent } from './allowance-proposal-error/allowance-proposal-error';
@NgModule({
    declarations: [AllowanceProposalSignIndexComponent,
        AllowanceProposalErrorComponent,
        AllowanceProposalSignSearchComponent,
        AllowanceProposalSignFormComponent,
        AllowanceProposalSignFormPopupComponent],
    imports: [
        CommonModule,
        SharedModule,
        AllowanceProposalSignRoutingModule
    ],
    providers: [NgbActiveModal],
    entryComponents: [AllowanceProposalSignFormPopupComponent,AllowanceProposalErrorComponent]
})
export class AllowanceProposalSignModule { }
