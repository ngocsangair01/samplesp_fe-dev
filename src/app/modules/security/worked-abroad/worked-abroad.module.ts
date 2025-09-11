import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared';
import {
    WorkedAbroadIndexComponent
} from "@app/modules/security/worked-abroad/worked-abroad-index/worked-abroad-index.component";
import {
    WorkedAbroadSearchComponent
} from "@app/modules/security/worked-abroad/worked-abroad-search/worked-abroad-search.component";
import {WorkedAbroadRoutingModule} from "@app/modules/security/worked-abroad/worked-abroad-routing.module";
import {
    WorkedAbroadFormComponent
} from "@app/modules/security/worked-abroad/worked-abroad-form/worked-abroad-form.component";
import {
    WorkedAbroadImportComponent
} from "@app/modules/security/worked-abroad/worked-abroad-import/worked-abroad-import.component";

@NgModule({
    declarations: [
        WorkedAbroadIndexComponent,
        WorkedAbroadSearchComponent,
        WorkedAbroadFormComponent,
        WorkedAbroadImportComponent],
    imports: [
        SharedModule,
        CommonModule,
        WorkedAbroadRoutingModule,
    ]
})
export class WorkedAbroadModule { }
