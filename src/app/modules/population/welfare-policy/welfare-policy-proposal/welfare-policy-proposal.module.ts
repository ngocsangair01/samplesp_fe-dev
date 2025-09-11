import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import {
  WelfarePolicyProposalComponent
} from "@app/modules/population/welfare-policy/welfare-policy-proposal/welfare-policy-proposal-index/welfare-policy-proposal-index.component";
import {
  WelfarePolicyProposalRoutingModule
} from "@app/modules/population/welfare-policy/welfare-policy-proposal/welfare-policy-proposal-routing.module";
import {
  WelfarePolicyProposalFormComponent
} from "@app/modules/population/welfare-policy/welfare-policy-proposal/welfare-policy-proposal-form/welfare-policy-proposal-form.component";
import {
  WelfarePolicyProposalPopupAddComponent
} from "./welfare-policy-proposal-form/welfare-policy-proposal-popup-add/welfare-policy-proposal-popup-add.component";
import {
  WelfarePolicyProposalPopupImportComponent
} from "@app/modules/population/welfare-policy/welfare-policy-proposal/welfare-policy-proposal-form/welfare-policy-proposal-popup-import/welfare-policy-proposal-popup-import.component";
import {
  WelfarePolicyProposalErrorComponent
} from "@app/modules/population/welfare-policy/welfare-policy-proposal/welfare-policy-proposal-error/welfare-policy-proposal-error";


@NgModule({
  declarations: [WelfarePolicyProposalComponent, WelfarePolicyProposalFormComponent, WelfarePolicyProposalPopupAddComponent, WelfarePolicyProposalPopupImportComponent,WelfarePolicyProposalErrorComponent],
  imports: [
    CommonModule,
    SharedModule,
    WelfarePolicyProposalRoutingModule,
  ],
  entryComponents: [WelfarePolicyProposalFormComponent, WelfarePolicyProposalPopupAddComponent, WelfarePolicyProposalPopupImportComponent,WelfarePolicyProposalErrorComponent]
})
export class WelfarePolicyProposalModule { }
