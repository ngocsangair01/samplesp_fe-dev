import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {AllowancePeriodRoutingModule} from "@app/modules/population/allowance-period/allowance-period-routing.module";
import {
    AllowancePeriodIndexComponent
} from "@app/modules/population/allowance-period/allowance-period-index/allowance-period-index.component";
import {
    AllowancePeriodSearchComponent
} from "@app/modules/population/allowance-period/allowance-period-search/allowance-period-search.component";
import {
    AllowancePeriodFormComponent
} from "@app/modules/population/allowance-period/allowance-period-forrn/allowance-period-form.component";


@NgModule({
    declarations: [AllowancePeriodIndexComponent, AllowancePeriodSearchComponent, AllowancePeriodFormComponent],
    imports: [
        CommonModule,
        SharedModule,
        AllowancePeriodRoutingModule
    ],
    providers: [NgbActiveModal],
    entryComponents: []
})
export class AllowancePeriodModule { }
