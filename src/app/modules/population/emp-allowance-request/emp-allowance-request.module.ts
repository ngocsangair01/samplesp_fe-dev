import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    EmpAllowanceRequestIndexComponent
} from "@app/modules/population/emp-allowance-request/emp-allowance-request-index/emp-allowance-request-index.component";
import {
    EmpAllowanceRequestSearchComponent
} from "@app/modules/population/emp-allowance-request/emp-allowance-request-search/emp-allowance-request-search.component";
import {
    EmpAllowanceRequestRoutingModule
} from "@app/modules/population/emp-allowance-request/emp-allowance-request-routing.module";
import {EmpAllowanceRequestFormComponent} from "./emp-allowance-request-form/emp-allowance-request-form.component";
import {
    EmpAllowanceRequestPopupComponent
} from "@app/modules/population/emp-allowance-request/emp-allowance-request-popup/emp-allowance-request-popup.component";


@NgModule({
    declarations: [EmpAllowanceRequestIndexComponent, EmpAllowanceRequestSearchComponent, EmpAllowanceRequestFormComponent, EmpAllowanceRequestPopupComponent],
    imports: [
        CommonModule,
        SharedModule,
        EmpAllowanceRequestRoutingModule,
    ],
    providers: [NgbActiveModal],
    entryComponents: [EmpAllowanceRequestFormComponent, EmpAllowanceRequestPopupComponent]
})
export class EmpAllowanceRequestModule { }
