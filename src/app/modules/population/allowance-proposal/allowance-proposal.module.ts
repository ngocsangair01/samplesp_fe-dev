import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    AllowanceProposalRoutingModule
} from "@app/modules/population/allowance-proposal/allowance-proposal-routing.module";
import {
    AllowanceProposalIndexComponent
} from "@app/modules/population/allowance-proposal/allowance-proposal-index/allowance-proposal-index.component";
import {
    AllowanceProposalSearchComponent
} from "@app/modules/population/allowance-proposal/allowance-proposal-search/allowance-proposal-search.component";
import {
    AllowanceProposalFormComponent
} from "@app/modules/population/allowance-proposal/allowance-proposal-form/allowance-proposal-form.component";
import {
    AllowanceProposalFormPopupComponent
} from "@app/modules/population/allowance-proposal/allowance-proposal-form/allowance-proposal-form-popup/allowance-proposal-form-popup.component";
import {
    EmpAllowanceRequestPopupComponent
} from "@app/modules/population/allowance-proposal/emp-allowance-request-popup/emp-allowance-request-popup.component";


@NgModule({
    declarations: [AllowanceProposalIndexComponent,
        AllowanceProposalSearchComponent,
        AllowanceProposalFormComponent,
        AllowanceProposalFormPopupComponent,
        EmpAllowanceRequestPopupComponent],
    imports: [
        CommonModule,
        SharedModule,
        AllowanceProposalRoutingModule
    ],
    providers: [NgbActiveModal],
    entryComponents: [AllowanceProposalFormPopupComponent, EmpAllowanceRequestPopupComponent]
})
export class AllowanceProposalModule { }
